import prisma from '@/lib/prisma';
import { TwitterApi } from 'twitter-api-v2';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import { SITE_URL } from '@/lib/seo';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

/**
 * Helper to fetch API credential from DB with fallback to process.env.
 */
async function getCredential(key: string): Promise<string | undefined> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    if (setting?.value) {
      return setting.value;
    }
  } catch (e) {
    console.error(`Failed to fetch setting "${key}" from database:`, e);
  }
  return process.env[key];
}

/**
 * Strips HTML tags from raw content and returns clean plain text.
 */
function cleanHtml(htmlContent: string): string {
  try {
    const $ = cheerio.load(htmlContent);
    $('script, style').remove();
    return $.text().replace(/\s+/g, ' ').trim();
  } catch (e) {
    console.error('Failed to clean HTML content:', e);
    return htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

/**
 * Downloads or loads the cover image as a Buffer.
 */
async function getImageBuffer(coverImage: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  try {
    if (coverImage.startsWith('data:')) {
      const parts = coverImage.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const base64Data = parts[1];
      return { buffer: Buffer.from(base64Data, 'base64'), mimeType: mime };
    }

    if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
      const res = await fetch(coverImage);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const mime = res.headers.get('content-type') || 'image/jpeg';
      return { buffer: Buffer.from(arrayBuffer), mimeType: mime };
    }

    // Local file path
    const fs = await import('fs');
    const path = await import('path');
    const publicPath = path.join(process.cwd(), 'public', coverImage);
    if (fs.existsSync(publicPath)) {
      const buffer = fs.readFileSync(publicPath);
      const ext = path.extname(coverImage).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.png') mime = 'image/png';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.gif') mime = 'image/gif';
      return { buffer, mimeType: mime };
    }
  } catch (e) {
    console.error('[Social Share] Failed to get image buffer:', e);
  }
  return null;
}

/**
 * Uses OpenAI to generate platform-tailored summaries + hashtags.
 */
async function generateSocialCaptions(title: string, rawContent: string, locale: string) {
  const cleanText = cleanHtml(rawContent);
  const excerptText = cleanText.substring(0, 1500); // Send first 1500 chars to save tokens
  const languageName = locale === 'fa' ? 'Persian (Farsi)' : 'English';

  const prompt = `
    You are a social media copywriter. Generate three tailored social media post captions for the following article content.
    
    Article Title: ${title}
    Article Excerpt Content: ${excerptText}
    
    Instructions:
    1. Write all captions entirely in ${languageName}.
    2. Generate exactly three platform-specific captions: linkedin, twitter, and facebook.
    3. Rules for each platform:
       - LinkedIn: Professional, authoritative, and thought-provoking tone. Start with a strong hook, write a single comprehensive paragraph summarizing the article, and include 5-10 highly relevant hashtags. Do NOT include any URL.
       - Twitter: Short, punchy, conversational, and direct tone. Write a very brief single paragraph (around 120-140 characters max) to ensure there is plenty of room for hashtags and a URL. Include 5-10 highly relevant hashtags. Do NOT include any URL.
       - Facebook: Friendly, engaging, and personal tone. Write a single inviting paragraph summarizing the article, and include 5-10 highly relevant hashtags. Do NOT include any URL.
    
    Return the response as a valid JSON object matching this schema:
    {
      "linkedin": "LinkedIn caption text",
      "twitter": "Twitter caption text",
      "facebook": "Facebook caption text"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
    });
    
    const rawJson = completion.choices[0].message.content || '{}';
    return JSON.parse(rawJson);
  } catch (error) {
    console.error('[Social Share] OpenAI caption generation failed, falling back to defaults:', error);
    return {
      linkedin: `${title}\n\nDiscover the latest insights in our new article. #visa #startup #migration`,
      twitter: `${title} - Read our new guide. #visa #startup #migration`,
      facebook: `${title}\n\nWe have just published a new article. Check it out! #visa #startup #migration`
    };
  }
}

/**
 * Shares an article to LinkedIn.
 */
async function shareToLinkedin(
  title: string,
  caption: string,
  url: string,
  imageInfo: { buffer: Buffer; mimeType: string } | null
): Promise<boolean> {
  const token = await getCredential('LINKEDIN_ACCESS_TOKEN');
  const authorUrn = await getCredential('LINKEDIN_AUTHOR_URN');

  if (!token || !authorUrn) {
    console.warn('[Social Share] LinkedIn sharing skipped: LINKEDIN_ACCESS_TOKEN or LINKEDIN_AUTHOR_URN not configured.');
    return false;
  }

  try {
    console.log(`[Social Share] Posting to LinkedIn: "${title}"`);

    const ctaText = authorUrn.includes('fa') || url.includes('/fa/') 
      ? 'برای مطالعه متن کامل به این لینک مراجعه کنید:' 
      : 'To read the full article, visit:';

    const textContent = `${caption}\n\n${ctaText}\n${url}`;
    let assetUrn: string | null = null;

    // 1. Upload image if available
    if (imageInfo) {
      console.log('[Social Share] Registering LinkedIn image upload...');
      const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: authorUrn,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent',
              },
            ],
          },
        }),
      });

      if (registerRes.ok) {
        const regData = await registerRes.json();
        const uploadMechanism = regData.value.uploadMechanism;
        const mechanismKey = Object.keys(uploadMechanism)[0];
        const uploadUrl = uploadMechanism[mechanismKey].uploadUrl;
        assetUrn = regData.value.asset;

        console.log('[Social Share] Uploading binary to LinkedIn...');
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': imageInfo.mimeType,
          },
          body: new Uint8Array(imageInfo.buffer),
        });

        if (!uploadRes.ok) {
          console.warn('[Social Share] LinkedIn binary upload failed, reverting to text sharing.');
          assetUrn = null;
        }
      } else {
        console.warn('[Social Share] LinkedIn image registration failed, reverting to text sharing.');
      }
    }

    // 2. Share post
    const requestBody: any = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: textContent,
          },
          shareMediaCategory: assetUrn ? 'IMAGE' : 'ARTICLE',
          media: assetUrn
            ? [
                {
                  status: 'READY',
                  description: { text: title },
                  media: assetUrn,
                  title: { text: title },
                },
              ]
            : [
                {
                  status: 'READY',
                  originalUrl: url,
                  title: { text: title },
                },
              ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`LinkedIn API responded with status ${response.status}: ${errText}`);
    }

    console.log('[Social Share] LinkedIn sharing successful.');
    return true;
  } catch (error) {
    console.error('[Social Share] LinkedIn sharing failed:', error);
    return false;
  }
}

/**
 * Shares an article to Twitter (X).
 */
async function shareToTwitter(
  title: string,
  caption: string,
  url: string,
  imageInfo: { buffer: Buffer; mimeType: string } | null
): Promise<boolean> {
  const consumerKey = await getCredential('TWITTER_CONSUMER_KEY');
  const consumerSecret = await getCredential('TWITTER_CONSUMER_SECRET');
  const accessToken = await getCredential('TWITTER_ACCESS_TOKEN');
  const accessSecret = await getCredential('TWITTER_ACCESS_SECRET');

  if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) {
    console.warn('[Social Share] Twitter/X sharing skipped: Twitter API keys not fully configured.');
    return false;
  }

  try {
    console.log(`[Social Share] Posting to Twitter/X: "${title}"`);
    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // Twitter limits standard tweets to 280 characters.
    // The URL takes exactly 23 characters.
    const maxTextLength = 240;
    let text = caption;
    if (text.length > maxTextLength) {
      text = text.substring(0, maxTextLength - 3) + '...';
    }
    const tweetContent = `${text}\n\n${url}`;

    let mediaId: string | undefined;
    if (imageInfo) {
      console.log('[Social Share] Uploading media to Twitter...');
      mediaId = await client.v1.uploadMedia(imageInfo.buffer, { mimeType: imageInfo.mimeType });
    }

    const payload: any = { text: tweetContent };
    if (mediaId) {
      payload.media = { media_ids: [mediaId] };
    }

    const res = await client.v2.tweet(payload);
    console.log('[Social Share] Twitter/X sharing successful. Tweet ID:', res.data.id);
    return true;
  } catch (error) {
    console.error('[Social Share] Twitter/X sharing failed:', error);
    return false;
  }
}

/**
 * Shares an article to Facebook.
 */
async function shareToFacebook(
  title: string,
  caption: string,
  url: string,
  imageInfo: { buffer: Buffer; mimeType: string } | null
): Promise<boolean> {
  const token = await getCredential('FACEBOOK_PAGE_ACCESS_TOKEN');
  const pageId = await getCredential('FACEBOOK_PAGE_ID');

  if (!token || !pageId) {
    console.warn('[Social Share] Facebook sharing skipped: FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID not configured.');
    return false;
  }

  try {
    console.log(`[Social Share] Posting to Facebook Page: "${title}"`);

    const ctaText = url.includes('/fa/') 
      ? 'برای مطالعه متن کامل به این لینک مراجعه کنید:' 
      : 'To read the full article, visit:';

    const textContent = `${caption}\n\n${ctaText}\n${url}`;

    const formData = new FormData();
    formData.append('access_token', token);

    let endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;

    if (imageInfo) {
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const blob = new Blob([new Uint8Array(imageInfo.buffer)], { type: imageInfo.mimeType });
      formData.append('source', blob, 'cover.jpg');
      formData.append('caption', textContent);
    } else {
      formData.append('message', textContent);
      formData.append('link', url);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Facebook API responded with status ${response.status}: ${errText}`);
    }

    console.log('[Social Share] Facebook sharing successful.');
    return true;
  } catch (error) {
    console.error('[Social Share] Facebook sharing failed:', error);
    return false;
  }
}

/**
 * Automatically publishes the article on configured social media channels.
 * Runs asynchronously and catches all exceptions internally.
 */
export async function shareToSocials(articleId: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      console.warn(`[Social Share] Article ${articleId} not found.`);
      return;
    }

    if (article.status !== 'PUBLISHED') {
      console.log(`[Social Share] Article "${article.title}" is in ${article.status} status. Social share skipped.`);
      return;
    }

    const linkedinToken = await getCredential('LINKEDIN_ACCESS_TOKEN');
    const linkedinAuthor = await getCredential('LINKEDIN_AUTHOR_URN');
    const twitterConsumerKey = await getCredential('TWITTER_CONSUMER_KEY');
    const twitterConsumerSecret = await getCredential('TWITTER_CONSUMER_SECRET');
    const twitterAccessToken = await getCredential('TWITTER_ACCESS_TOKEN');
    const twitterAccessSecret = await getCredential('TWITTER_ACCESS_SECRET');
    const facebookToken = await getCredential('FACEBOOK_PAGE_ACCESS_TOKEN');
    const facebookPageId = await getCredential('FACEBOOK_PAGE_ID');

    const hasLinkedin = !!linkedinToken && !!linkedinAuthor;
    const hasTwitter = !!twitterConsumerKey && !!twitterConsumerSecret && !!twitterAccessToken && !!twitterAccessSecret;
    const hasFacebook = !!facebookToken && !!facebookPageId;

    if (!hasLinkedin && !hasTwitter && !hasFacebook) {
      return;
    }

    console.log(`[Social Share] Initiating tailored social sharing pipeline for article "${article.title}"`);

    const url = `${SITE_URL}/${article.locale}/blog/${article.slug}`;

    // Get image buffer if coverImage exists
    let imageInfo: { buffer: Buffer; mimeType: string } | null = null;
    if (article.coverImage) {
      imageInfo = await getImageBuffer(article.coverImage);
    }

    // Generate dynamic captions via OpenAI
    const captions = await generateSocialCaptions(article.title, article.content, article.locale);

    const updates: {
      sharedToLinkedin?: boolean;
      sharedToTwitter?: boolean;
      sharedToFacebook?: boolean;
    } = {};

    // 1. Share to LinkedIn
    if (!article.sharedToLinkedin && hasLinkedin) {
      const success = await shareToLinkedin(article.title, captions.linkedin, url, imageInfo);
      if (success) updates.sharedToLinkedin = true;
    }

    // 2. Share to Twitter
    if (!article.sharedToTwitter && hasTwitter) {
      const success = await shareToTwitter(article.title, captions.twitter, url, imageInfo);
      if (success) updates.sharedToTwitter = true;
    }

    // 3. Share to Facebook
    if (!article.sharedToFacebook && hasFacebook) {
      const success = await shareToFacebook(article.title, captions.facebook, url, imageInfo);
      if (success) updates.sharedToFacebook = true;
    }

    // Update database flags for successful posts
    if (Object.keys(updates).length > 0) {
      await prisma.article.update({
        where: { id: articleId },
        data: updates,
      });
      console.log(`[Social Share] Social sharing flags updated in database:`, updates);
    } else {
      console.log(`[Social Share] Social sharing pipeline finished (no actions taken).`);
    }

  } catch (error) {
    console.error('[Social Share] Unexpected error in social sharing manager:', error);
  }
}
