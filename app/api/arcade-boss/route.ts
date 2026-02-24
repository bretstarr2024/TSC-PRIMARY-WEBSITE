import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, game, score, initials } = body;

    if (!email || !game) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const { getDatabase } = await import('@/lib/mongodb');
      const db = await getDatabase();
      await db.collection('arcade_bosses').insertOne({
        email,
        game,
        score: score || 0,
        initials: initials || '???',
        createdAt: new Date(),
      });
    } catch {
      // Graceful degradation if MongoDB unavailable (e.g. local dev)
      console.warn('arcade-boss: MongoDB unavailable, email not stored');
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
