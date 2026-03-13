import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { GAME_LABELS } from '@/lib/arcade/games';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`arcade-score:${ip}`, { maxRequests: 30, windowMs: 60_000 });
    if (rl.limited) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { game, initials, score, email } = body;

    // Validate game
    if (typeof game !== 'string' || !GAME_LABELS[game]) {
      return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
    }

    // Validate initials
    if (typeof initials !== 'string' || initials.length < 1 || initials.length > 3) {
      return NextResponse.json({ error: 'Invalid initials' }, { status: 400 });
    }
    const safeInitials = initials.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);

    // Validate score
    const safeScore = typeof score === 'number' && Number.isFinite(score) && score >= 0
      ? Math.floor(score) : 0;

    // Validate email (required)
    if (typeof email !== 'string' || email.length > 320 || !emailRe.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }
    const safeEmail = email.toLowerCase().trim();

    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    const col = db.collection('arcade_scores');

    // Insert score record
    await col.insertOne({
      game,
      initials: safeInitials,
      email: safeEmail,
      score: safeScore,
      createdAt: new Date(),
    });

    // Calculate rank for this game
    const [rank, total] = await Promise.all([
      col.countDocuments({ game, score: { $gt: safeScore } }).then(n => n + 1),
      col.countDocuments({ game }),
    ]);

    return NextResponse.json({
      ok: true,
      rank,
      total,
      gameLabel: GAME_LABELS[game],
    });
  } catch (err) {
    console.error('[arcade/score]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
