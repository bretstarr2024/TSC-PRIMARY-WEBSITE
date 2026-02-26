import { NextResponse } from 'next/server';

// Allowlisted fields for tracking interactions.
// Only these fields are stored — everything else is discarded.
function pickTrackingFields(body: Record<string, unknown>): Record<string, unknown> {
  const ALLOWED_KEYS = [
    'type', 'sessionId', 'page', 'component', 'label',
    'destination', 'ctaId', 'referrer', 'userAgent', 'viewport',
    'metadata',
  ] as const;

  const picked: Record<string, unknown> = {};
  for (const key of ALLOWED_KEYS) {
    if (body[key] !== undefined) {
      picked[key] = body[key];
    }
  }
  return picked;
}

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
        ...pickTrackingFields(body),
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
