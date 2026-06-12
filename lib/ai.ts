import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { ensureDefaultCategories } from '@/lib/categories';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

const FAL_KEY = process.env.FAL_KEY;

// Generate Image using Fal.ai (Flux) and save locally
export async function generateAndSaveImage(prompt: string): Promise<string> {
  console.log('Generating image for prompt:', prompt);
  
  const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      image_size: 'landscape_4_3',
      num_inference_steps: 4,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Fal.ai error:', error);
    throw new Error('Image generation failed');
  }

  const data = await response.json();
  const imageUrl = data.images[0].url;

  // Download the image and return as Base64 data URL to prevent stateless 404s
  const imageRes = await fetch(imageUrl);
  const arrayBuffer = await imageRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  
  return `data:image/jpeg;base64,${base64}`;
}

export async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // Remove script and style elements
  $('script, style, nav, footer, header').remove();
  
  return $('body').text().replace(/\s+/g, ' ').trim();
}

export async function generateArticlePayload(mode: 'KEYWORD' | 'URL' | 'TEXT', input: string) {
  // Ensure default categories exist first
  await ensureDefaultCategories();

  // Fetch existing categories from DB
  const categories = await prisma.category.findMany();
  const categoryNames = categories.map(c => c.name);

  let sourceText = input;
  
  if (mode === 'URL') {
    sourceText = await scrapeUrl(input);
  }

  const prompt = `
    You are an expert Content Writer and SEO/AEO/AIO (Search, Answer, and AI Engine Optimization) specialist.
    I need you to write/rewrite a highly engaging, optimized article based on the input.
    
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
    8. I need 2 images inside the text. Place placeholders exactly like this: [IMAGE_PLACEHOLDER_1] and [IMAGE_PLACEHOLDER_2] in the HTML content where appropriate.
    9. Provide a detailed prompt for the cover image (to be generated by AI).
    10. Provide detailed prompts for the 2 in-text images.

    Return the response as a valid JSON object. All keys (including category and tags) must be provided. Values in quickFacts must be written in the same language as the article content (Persian if the article is in Persian, English if the article is in English):
    {
      "title": "SEO Optimized Title",
      "excerpt": "A short 2 sentence excerpt.",
      "category": "Select EXACTLY one of these existing categories: ${JSON.stringify(categoryNames)}. Do NOT create new categories.",
      "tags": ["tag1", "tag2", "tag3"],
      "content": "<h1>...</h1>...[IMAGE_PLACEHOLDER_1]...",
      "quickFacts": {
        "readingTime": "e.g., 4 min read (or ۴ دقیقه مطالعه in Persian)",
        "level": "e.g., Strategic / Deep Dive (or راهبردی / پیشرفته in Persian)",
        "suitableFor": "e.g., Tech Founders & Co-founders (or بنیان‌گذاران استارتاپ in Persian)",
        "compliance": "e.g., 95% (IRCC Official Guidelines) (or ۹۵٪ تطابق با مستندات رسمی in Persian)",
        "keyBenefit": "e.g., Pathway selection clarity (or شفافیت در انتخاب مسیر in Persian)",
        "status": "e.g., Validated for 2026 regulations (or تایید شده برای قوانین ۲۰۲۶ in Persian)",
        "actionability": "e.g., High (Step-by-step roadmap) (or بالا (راهنمای عملی گام‌به‌گام) in Persian)",
        "requirements": "e.g., Business Plan & IELTS 5.5 (or بیزینس پلن و مدرک زبان in Persian)"
      },
      "coverImagePrompt": "High quality editorial photo of...",
      "inTextImagePrompts": [
        "Prompt for image 1...",
        "Prompt for image 2..."
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

  // Generate Images
  const coverImageUrl = await generateAndSaveImage(result.coverImagePrompt);
  
  let finalContent = result.content;
  if (result.inTextImagePrompts && result.inTextImagePrompts.length > 0) {
    for (let i = 0; i < result.inTextImagePrompts.length; i++) {
      const prompt = result.inTextImagePrompts[i];
      try {
        const url = await generateAndSaveImage(prompt);
        finalContent = finalContent.replace(`[IMAGE_PLACEHOLDER_${i + 1}]`, `<img src="${url}" alt="Article Image" class="w-full rounded-2xl my-8 shadow-lg" />`);
      } catch (e) {
        console.error('Failed to generate in-text image', e);
      }
    }
  }

  // Prepend the Quick Facts JSON block inside a hidden script tag
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
