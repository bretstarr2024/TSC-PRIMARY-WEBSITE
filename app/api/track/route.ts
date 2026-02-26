import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

// Field length limits
const MAX_STRING_FIELD = 500;

// Allowlisted fields for tracking interactions.
// Only these fields are stored — everything else is discarded.
function pickTrackingFields(body: Record<string, unknown>): Record<string, unknown> {
  const ALLOWED_KEYS = [
    'type', 'sessionId', 'page', 'component', 'label',
    'destination', 'ctaId', 'referrer', 'userAgent', 'viewport',
  ] as const;

  const picked: Record<string, unknown> = {};
  for (const key of ALLOWED_KEYS) {
    const val = body[key];
    if (val === undefined) continue;
    // Only accept string or number values — reject objects/arrays
    if (typeof val === 'string') {
      picked[key] = val.slice(0, MAX_STRING_FIELD);
    } else if (typeof val === 'number') {
      picked[key] = val;
    }
  }
  return picked;
}

export async function POST(request: Request) {
  try {
    // Rate limit: 60 tracking events per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`track:${ip}`, { maxRequests: 60, windowMs: 60_000 });
    if (rl.limited) {
      return NextResponse.json({ ok: true }); // Silent drop — beacons don't retry
    }

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
