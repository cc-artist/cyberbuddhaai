import OpenAI from 'openai';

// 创建OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1'
});

export async function generateImage(prompt: string, size: string = '1024x1024'): Promise<string | null> {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      console.warn('OpenAI API key not configured');
      return null;
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: size,
      quality: 'standard',
      n: 1
    });

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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating text:', error);
    return null;
  }
}

export async function generateBlessingAnimation(prompt: string): Promise<string | null> {
  try {
    // 构建完整的加持动画提示词
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

export default openai;