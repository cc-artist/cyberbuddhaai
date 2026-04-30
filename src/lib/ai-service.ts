import OpenAI from 'openai';

// 延迟初始化OpenAI客户端
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1'
    });
  }
  return openai;
}

type ImageSize = '256x256' | '512x512' | '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792';

export async function generateImage(prompt: string, size: ImageSize = '1024x1024'): Promise<string | null> {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      console.warn('OpenAI API key not configured');
      return null;
    }

    const client = getOpenAIClient();
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: size,
      quality: 'standard',
      n: 1
    });

    if (!response.data || response.data.length === 0) {
      console.warn('No image data returned');
      return null;
    }

    return response.data[0]?.url || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

export async function generateText(prompt: string, maxTokens: number = 500): Promise<string | null> {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      console.warn('OpenAI API key not configured');
      return null;
    }

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens
    });

    if (!response.choices || response.choices.length === 0) {
      console.warn('No text data returned');
      return null;
    }

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating text:', error);
    return null;
  }
}

export async function generateBlessingAnimation(prompt: string): Promise<string | null> {
  try {
    const fullPrompt = `Cyber Buddha blessing ${prompt}, digital art style, sacred golden light particles, serene purple ambiance, modern minimalist design, high quality, 8K, ultra detailed, Apple product launch style, Zen Buddhism aesthetic, ethereal atmosphere, soft glow effects, futuristic temple background`;

    return await generateImage(fullPrompt, '1024x1024');
  } catch (error) {
    console.error('Error generating blessing animation:', error);
    return null;
  }
}

export function isAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;
}