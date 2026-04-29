import { NextResponse } from 'next/server';
import { generateImage, generateText, generateBlessingAnimation, isAIConfigured } from '../../../../lib/ai-service';

export async function POST(request: Request) {
  try {
    // 检查AI是否配置
    if (!isAIConfigured()) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const { type, prompt } = await request.json();

    if (!type || !prompt) {
      return NextResponse.json({ error: 'type and prompt are required' }, { status: 400 });
    }

    let result: string | null = null;

    switch (type) {
      case 'image':
        result = await generateImage(prompt);
        break;
      case 'text':
        result = await generateText(prompt);
        break;
      case 'blessing':
        result = await generateBlessingAnimation(prompt);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 返回AI服务状态
    const configured = isAIConfigured();
    return NextResponse.json({ configured }, { status: 200 });
  } catch (error) {
    console.error('Error checking AI status:', error);
    return NextResponse.json({ configured: false }, { status: 200 });
  }
}