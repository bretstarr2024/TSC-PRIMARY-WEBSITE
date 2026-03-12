import { NextResponse } from 'next/server';
import { GAME_LABELS } from '@/lib/arcade/games';

export async function GET() {
  try {
    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    const col = db.collection('arcade_scores');

    const [
      totalPlays,
      emailsCaptured,
      playsByGameRaw,
      recentRaw,
      uniqueEmailsRaw,
    ] = await Promise.all([
      col.countDocuments(),
      col.countDocuments({ email: { $exists: true, $ne: null } }),
      col.aggregate([
        { $group: { _id: '$game', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      col.find({}, { projection: { _id: 0, game: 1, initials: 1, score: 1, email: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray(),
      col.distinct('email', { email: { $exists: true, $ne: null } }),
    ]);

    const playsByGame = playsByGameRaw.map((g: any) => ({
      game: g._id,
      label: GAME_LABELS[g._id] || g._id,
      count: g.count,
    }));

    const recentPlays = recentRaw.map((r: any) => ({
      game: r.game,
      label: GAME_LABELS[r.game] || r.game,
      initials: r.initials,
      score: r.score,
      hasEmail: !!r.email,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      totalPlays,
      uniquePlayers: uniqueEmailsRaw.length,
      emailsCaptured,
      emailRate: totalPlays > 0 ? Math.round((emailsCaptured / totalPlays) * 100) : 0,
      playsByGame,
      recentPlays,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[arcade/stats]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
