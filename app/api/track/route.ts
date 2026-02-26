import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.type || !body.sessionId) {
      return NextResponse.json({ ok: true });
    }

    try {
      const { getDatabase } = await import('@/lib/mongodb');
      const db = await getDatabase();
      await db.collection('interactions').insertOne({
        ...body,
        timestamp: new Date(),
      });
    } catch {
      // Graceful degradation — tracking should never 500
      console.warn('track: MongoDB unavailable, interaction not stored');
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Even malformed JSON should return 200 — beacons don't retry
    return NextResponse.json({ ok: true });
  }
}
