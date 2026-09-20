import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { ensureDefaultCategories } from '@/lib/categories';
import { storeImage } from '@/lib/storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});


/**
 * Style suffix appended to every Fal.ai photo prompt for consistent
 * editorial quality. Keep it short — the model blends it naturally.
 */
const PHOTO_STYLE_SUFFIX =
  ', professional editorial photography, sharp focus, high dynamic range, ' +
  'cinematic lighting, modern business environment, photorealistic, highly ' +
  'detailed, no text overlays, no watermarks, no logos';

// ─── Image Generation ─────────────────────────────────────────────────────────

export type ImageOptions = {
  /** Skip PHOTO_STYLE_SUFFIX — for prompts that carry their own art direction (the autopilot). */
  raw?: boolean;
  /** Fal image_size preset. Covers render in a 16:9 frame on the article page. */
  size?: 'landscape_4_3' | 'landscape_16_9' | 'square_hd';
  /** Providers to try first, best-first. The rest stay on as fallbacks. */
  prefer?: ImageProvider[];
};

/**
 * Image providers, in the order they are tried.
 *
 * Fal (flux/dev) is the house look and the cheaper of the two. OpenAI
 * gpt-image-2 is the standby, and it exists because on 14 Sep 2026 the Fal
 * account was locked for a top-up and every article for the next six days
 * published with no cover at all — generateBrandImage swallows the failure
 * by design, so nothing shouted. One dead provider must not cost a week of
 * imagery again.
 *
 * The two are not interchangeable in quality. Across the twelve covers
 * backfilled on 20 Sep 2026, gpt-image-2 held the art direction every time
 * while flux drifted — soft CGI surfaces, a green cast, and once two toy
 * robots with a figure walking behind them. So the caller says which
 * provider it wants first: covers are the frame everyone sees and go to
 * OpenAI, in-article photos are smaller and more numerous and go to Fal.
 *
 * IMAGE_PROVIDER_ORDER="openai,fal" overrides every caller's preference; a
 * provider whose key is missing drops out of the chain on its own.
 */
export type ImageProvider = 'fal' | 'openai';

export function imageProviders(prefer?: ImageProvider[]): ImageProvider[] {
  const configured: Record<ImageProvider, boolean> = {
    fal: Boolean(process.env.FAL_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
  };
  const order = process.env.IMAGE_PROVIDER_ORDER
    ? process.env.IMAGE_PROVIDER_ORDER.split(',')
    : (prefer ?? ['fal', 'openai']);
  const chain = order
    .map((p) => String(p).trim().toLowerCase())
    .filter((p): p is ImageProvider => p === 'fal' || p === 'openai')
    .filter((p) => configured[p]);
  // A preference must never shrink the chain: whatever is configured stays
  // available as a fallback, just after what the caller asked for.
  for (const p of ['fal', 'openai'] as ImageProvider[]) {
    if (configured[p] && !chain.includes(p)) chain.push(p);
  }
  return chain;
}

type RawImage = { bytes: Uint8Array; contentType: string };

/**
 * Generate a photo and persist it through the pluggable storage layer.
 * Each provider is tried in turn; the last error is reported only when all
 * of them have failed, so a locked account degrades to the standby instead
 * of to a missing image.
 */
export async function generateAndSaveImage(prompt: string, opts: ImageOptions = {}): Promise<string> {
  const providers = imageProviders(opts.prefer);
  if (providers.length === 0) throw new Error('No image provider configured (FAL_KEY / OPENAI_API_KEY)');

  const fullPrompt = opts.raw ? prompt : `${prompt}${PHOTO_STYLE_SUFFIX}`;
  console.log('[AI] Generating photo — prompt:', prompt.slice(0, 120));

  const failures: string[] = [];
  for (const provider of providers) {
    try {
      const image = provider === 'fal' ? await generateWithFal(fullPrompt, opts) : await generateWithOpenAI(fullPrompt, opts);
      if (provider !== providers[0]) console.warn(`[AI] Photo came from the standby provider "${provider}"`);
      return await storeImage(image.bytes, image.contentType);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[AI] Image provider "${provider}" failed: ${message}`);
      failures.push(`${provider}: ${message}`);
    }
  }
  throw new Error(`Image generation failed — ${failures.join('; ')}`);
}

/** Fal.ai Flux Dev (28-step diffusion). */
async function generateWithFal(prompt: string, opts: ImageOptions): Promise<RawImage> {
  const response = await fetch('https://fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: opts.size ?? 'landscape_4_3',
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: false,
    }),
  });

  if (!response.ok) {
    // The body carries the reason — "User is locked. Reason: TOP_UP" is a
    // billing problem, not a bug, and the log must say so.
    throw new Error(`fal.run ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }

  const data = await response.json();
  const imageUrl = data?.images?.[0]?.url;
  if (!imageUrl) throw new Error('fal.run returned no image URL');

  // Download from Fal's CDN. IMPORTANT: validate before storing — if the CDN
  // returns an error page, throw, rather than persisting "Internal server
  // error" as a JPEG.
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error(`Failed to download generated image (${imageRes.status}): ${imageUrl}`);
  const contentType = imageRes.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`fal CDN returned non-image content-type "${contentType}"`);

  return { bytes: new Uint8Array(await imageRes.arrayBuffer()), contentType };
}

/**
 * OpenAI gpt-image-2. It returns base64 rather than a URL, and it has no
 * 16:9 preset — 1536×1024 is the widest frame on offer and crops cleanly to
 * the article header. JPEG at quality 80 keeps a cover around 200 KB, in
 * line with what Fal was putting in the bucket.
 */
async function generateWithOpenAI(prompt: string, opts: ImageOptions): Promise<RawImage> {
  const size = opts.size === 'square_hd' ? '1024x1024' : '1536x1024';
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2',
      prompt,
      size,
      quality: process.env.OPENAI_IMAGE_QUALITY ?? 'medium',
      output_format: 'jpeg',
      output_compression: 80,
      n: 1,
    }),
  });

  if (!response.ok) throw new Error(`openai images ${response.status}: ${(await response.text()).slice(0, 200)}`);

  const data = await response.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('openai returned no image data');
  return { bytes: Uint8Array.from(Buffer.from(b64, 'base64')), contentType: 'image/jpeg' };
}

// ─── Diagram Helpers ──────────────────────────────────────────────────────────

/**
 * Wrap an SVG diagram (generated by GPT-4o) in a styled article container.
 * SVG code is embedded directly — no image encoding needed, fully crisp at
 * any resolution, and text inside the diagram remains selectable/searchable.
 */
export function wrapDiagram(svgCode: string, caption: string): string {
  const cap = caption
    ? `<figcaption class="text-center text-sm text-[#1c3b6e]/60 pb-5 italic px-6">${caption}</figcaption>`
    : '';
  return (
    `<figure class="my-10 rounded-2xl overflow-hidden shadow-md border border-[#1c3b6e]/10 bg-white">` +
    `<div class="p-6 flex justify-center items-center overflow-x-auto">${svgCode}</div>` +
    `${cap}</figure>`
  );
}

/**
 * Wrap a generated photo in a styled article container with lazy-loading
 * and a proper figcaption for accessibility and SEO.
 */
export function wrapPhoto(url: string, caption: string, index: number): string {
  const alt = caption || `Article visual ${index + 1}`;
  const cap = caption
    ? `<figcaption class="text-center text-sm text-gray-500 mt-3 italic">${caption}</figcaption>`
    : '';
  return (
    `<figure class="my-10">` +
    `<img src="${url}" alt="${alt}" class="w-full rounded-2xl shadow-lg" loading="lazy" />` +
    `${cap}</figure>`
  );
}

// ─── URL Scraping ─────────────────────────────────────────────────────────────

export async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

// ─── Article Payload Generation ───────────────────────────────────────────────

export async function generateArticlePayload(
  mode: 'KEYWORD' | 'URL' | 'TEXT',
  input: string,
  locale: 'en' | 'fa' = 'en',
) {
  // Ensure default categories exist first
  await ensureDefaultCategories();

  // Fetch existing categories from DB
  const categories = await prisma.category.findMany();
  const categoryNames = categories.map((c) => c.name);

  let sourceText = input;
  if (mode === 'URL') {
    sourceText = await scrapeUrl(input);
  }

  const languageName = locale === 'fa' ? 'Persian (Farsi)' : 'English';

  const prompt = `
    You are an expert Content Writer and SEO/AEO/AIO (Search, Answer, and AI Engine Optimization) specialist.
    I need you to write/rewrite a highly engaging, optimized article based on the input.

    IMPORTANT: Write the ENTIRE article (title, excerpt, content, tags, quickFacts) in ${languageName}.

    Mode: ${mode}
    Input Data: ${sourceText}

    Rules:
    1. Structure the article with H2 and H3 tags. Use clear spacing and hierarchy.
    2. Dynamically determine the strategic importance, complexity, and educational value of the topic based on the input data:
       - **Core/High-Importance Pathways & Ultimate Guides** (e.g., Canada Startup Visa requirements, US EB-2 NIW business plan structures, comprehensive provincial nominee comparisons, official guideline breakdowns): Write an ultimate, masterclass-level deep dive of **up to 3000 words (between 2000 and 3000 words)**. Cover every legal sub-clause, detailed documentation requirements, step-by-step processes, risk mitigation strategies, and case studies. Use at least 6-8 detailed sections.
       - **Standard/Specific Topics**: Write a comprehensive, highly informative guide of **around 1000 to 1400 words**, organizing it into at least 4-5 detailed sections.
       - Do NOT truncate or write placeholders. Write the full extensive sections and paragraphs. Assess this importance intelligently and adjust the length dynamically.
    3. Blend SEO, AEO, and AIO optimization techniques:
       - SEO: Natural density of relevant keywords, semantic phrasing, and logical content hierarchy.
       - AEO (Answer Engine Optimization): Provide clear, direct, and structured 1-2 sentence answers immediately following question headings (ideal for Featured Snippets and voice search).
       - AIO (Artificial Intelligence Optimization): Design content so AI search tools (Perplexity, Gemini, ChatGPT Search) can easily parse facts. Include structured comparison lists, or short tabular layouts in the HTML.
    4. Include an FAQ section with schema-friendly H3 questions at the end (AEO/AIO best practice).
    5. The content must be formatted in clean HTML (do NOT wrap it in markdown tags like \`\`\`html).
    6. Make the layout look premium, clean, and highly structured:
       - Wrap key concepts or quotes in callout boxes: <div class="p-5 my-6 border-l-4 border-[#CCFF00] bg-[#1a1a1a]/[0.02] rounded-r-lg font-sans"><strong>Key Note:</strong> ...</div>
       - Use structured HTML tables for comparisons or timelines: <table class="min-w-full my-6 border-collapse border border-[#1a1a1a]/10"><thead><tr class="bg-[#1a1a1a]/5">...</tr></thead><tbody>...</tbody></table>
       - Bold important words, visa program names, specific requirements/thresholds (e.g. monetary limits, IELTS scores, age limits), and crucial terms using <strong> tags naturally within sentences and paragraphs to make the content highly scannable and emphasize key highlights.
       - Use bullet points (<ul class="list-disc pl-5 my-4">) for lists and key highlights.
       - Do NOT use horizontal rules (<hr />) or line breaks to separate sections.
    7. Write in a modern, professional, yet brutal/no-nonsense editorial tone.
    8. Place exactly 2 visual element placeholders in the HTML content at natural breakpoints where a visual would enhance comprehension (usually after the first major section and mid-article): [VISUAL_1] and [VISUAL_2].
    9. Provide a detailed prompt for the cover image (editorial photography — describe scene, lighting, subjects, mood, no text in scene).
    10. For each of the 2 in-article visuals, decide intelligently whether it should be a PHOTO or a DIAGRAM:

        **PHOTO** — Use when the concept is best shown as a realistic scene (people working, a city skyline, a meeting, a product, a concept metaphor).
          - Provide a rich, highly detailed editorial photography prompt.
          - Describe: subjects, environment, lighting, camera angle, mood, color palette.
          - NEVER include text overlays or infographic elements in a PHOTO prompt.

        **DIAGRAM** — Use when the content has a process, steps, timeline, comparison, or hierarchy (e.g., application process flowchart, program comparison matrix, eligibility decision tree, milestone timeline).
          - You MUST write the complete, valid SVG code yourself. Requirements:
            • Opening tag: <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:800px">
            • Brand colors: navy #1c3b6e (primary fills, arrows, headings), gold #f2b95e (accent/highlight boxes), white #ffffff (card backgrounds), light-gray #f4f5f8 (section fills), dark-text #374151 (body text).
            • Always define an arrowhead marker in <defs>: <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#1c3b6e"/></marker>
            • Use <line> or <path> with marker-end="url(#arrow)" for flow connections.
            • All labels must be inside <text> elements with font-size="13" or "14", placed clearly inside or directly adjacent to their shapes.
            • Shapes: <rect rx="8"> for cards/boxes, <circle> for steps, <polygon> for decisions.
            • Keep it clean and uncluttered — generous padding, breathing room between elements.
            • NO external fonts, NO embedded images, NO foreignObject.
            • The SVG must be self-contained and render correctly in a browser without any external dependencies.

    Return the response as a valid JSON object. All keys must be provided. Values in quickFacts must be written in the same language as the article content (Persian if fa, English if en):
    {
      "title": "SEO Optimized Title",
      "excerpt": "A short 2 sentence excerpt.",
      "category": "Select EXACTLY one of these existing categories: ${JSON.stringify(categoryNames)}. Do NOT create new categories.",
      "tags": ["tag1", "tag2", "tag3"],
      "content": "<h1>...</h1>...[VISUAL_1]...[VISUAL_2]...",
      "quickFacts": {
        "suitableFor": "e.g., Tech Founders & Co-founders (or بنیان‌گذاران استارتاپ in Persian)",
        "requirements": "Include only requirements explicitly grounded in the input (in the article language)"
      },
      "coverImagePrompt": "High quality editorial photo of...",
      "inTextVisuals": [
        {
          "type": "PHOTO",
          "prompt": "Highly detailed editorial photography prompt describing scene, lighting, subjects, mood...",
          "caption": "Descriptive, informative caption for this image"
        },
        {
          "type": "DIAGRAM",
          "svgCode": "<svg viewBox='0 0 800 450' xmlns='http://www.w3.org/2000/svg' width='100%' style='max-width:800px'>...</svg>",
          "caption": "Caption describing what the diagram illustrates"
        }
      ]
    }
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt }],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  });

  const rawJson = completion.choices[0].message.content || '{}';
  const result = JSON.parse(rawJson);

  // ── Cover image ──────────────────────────────────────────────────────────
  // Never let a failed cover image abort the whole article.
  let coverImageUrl: string | null = null;
  try {
    if (result.coverImagePrompt) {
      coverImageUrl = await generateAndSaveImage(result.coverImagePrompt);
    }
  } catch (e) {
    console.error('[AI] Failed to generate cover image, continuing without it', e);
  }

  // ── In-text visuals ──────────────────────────────────────────────────────
  let finalContent = result.content as string;

  // Support new format (inTextVisuals) with backward-compat for legacy format (inTextImagePrompts).
  type VisualItem = {
    type: string;
    prompt?: string;
    svgCode?: string;
    caption?: string;
  };

  const visuals: VisualItem[] =
    result.inTextVisuals ??
    (result.inTextImagePrompts as string[] | undefined)?.map((p: string) => ({
      type: 'PHOTO',
      prompt: p,
      caption: '',
    })) ??
    [];

  for (let i = 0; i < visuals.length; i++) {
    const visual = visuals[i];

    // Support both new placeholder format [VISUAL_N] and legacy [IMAGE_PLACEHOLDER_N]
    const placeholder = `[VISUAL_${i + 1}]`;
    const legacyPlaceholder = `[IMAGE_PLACEHOLDER_${i + 1}]`;

    let replacement = '';

    if (visual.type === 'DIAGRAM' && visual.svgCode) {
      // Diagrams: embed SVG directly — crisp at any resolution, text is selectable
      console.log(`[AI] Embedding SVG diagram for visual ${i + 1}`);
      replacement = wrapDiagram(visual.svgCode, visual.caption ?? '');
    } else if (visual.prompt) {
      // Photos: generate via Fal.ai flux/dev
      try {
        console.log(`[AI] Generating photo for visual ${i + 1}`);
        const url = await generateAndSaveImage(visual.prompt);
        replacement = wrapPhoto(url, visual.caption ?? '', i);
      } catch (e) {
        console.error(`[AI] Failed to generate in-text photo for visual ${i + 1}`, e);
        // Leave placeholder removed but don't crash — article still saved without this visual
      }
    }

    if (replacement) {
      finalContent = finalContent.replace(placeholder, replacement);
      finalContent = finalContent.replace(legacyPlaceholder, replacement);
    } else {
      // Remove unfilled placeholders so they don't appear as raw text in the article
      finalContent = finalContent.replace(placeholder, '');
      finalContent = finalContent.replace(legacyPlaceholder, '');
    }
  }

  // Safety net: strip any remaining placeholders that weren't processed
  finalContent = finalContent.replace(/\[VISUAL_\d+\]/g, '');
  finalContent = finalContent.replace(/\[IMAGE_PLACEHOLDER_\d+\]/g, '');

  // ── Quick Facts ──────────────────────────────────────────────────────────
  if (result.quickFacts) {
    const jsonTag = `<script type="application/json" id="quick-facts-data">${JSON.stringify(result.quickFacts)}</script>\n`;
    finalContent = jsonTag + finalContent;
  }

  return {
    title: result.title,
    excerpt: result.excerpt,
    category: result.category,
    tags: result.tags,
    content: finalContent,
    coverImage: coverImageUrl,
  };
}
