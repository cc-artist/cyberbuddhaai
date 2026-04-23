import { NextResponse } from 'next/server';
import { temples as mockTemples } from '../../../../../data/TempleData';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Missing temple id' }, { status: 400 });
    }
    
    // 这里应该从数据库获取数据，现在使用mock数据
    const temple = mockTemples.find(t => t.id === parseInt(id));
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }
    
    return NextResponse.json(temple, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch temple' }, { status: 500 });
  }
}