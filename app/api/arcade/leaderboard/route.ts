import { NextResponse } from 'next/server';
import { GAME_LABELS } from '@/lib/arcade/games';

export const revalidate = 30; // ISR — refresh every 30s

export async function GET() {
  try {
    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    const col = db.collection('arcade_scores');

    // ── Aggregate leaderboard: best score per player per game, summed ──
    // Group by email (always present now) — initials as display name
    const aggregatePipeline = [
      // Only include scores that have an email
      { $match: { email: { $exists: true, $nin: [null, ''] } } },
      // Step 1: best score per (player, game)
      {
        $group: {
          _id: {
            player: '$email',
            game: '$game',
          },
          bestScore: { $max: '$score' },
          initials: { $first: '$initials' },
        },
      },
      // Step 2: sum across games per player
      {
        $group: {
          _id: '$_id.player',
          totalScore: { $sum: '$bestScore' },
          gamesPlayed: { $sum: 1 },
          initials: { $first: '$initials' },
          gameBreakdown: {
            $push: { game: '$_id.game', score: '$bestScore' },
          },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 100 },
      {
        $project: {
          _id: 0,
          initials: 1,
          totalScore: 1,
          gamesPlayed: 1,
          gameBreakdown: 1,
        },
      },
    ];

    // ── Per-game top 10 ──
    const perGamePipeline = [
      { $match: { email: { $exists: true, $nin: [null, ''] } } },
      // Best score per player per game (grouped by email)
      {
        $group: {
          _id: {
            player: '$email',
            game: '$game',
          },
          bestScore: { $max: '$score' },
          initials: { $first: '$initials' },
        },
      },
      { $sort: { bestScore: -1 } },
      // Group by game, collect top entries
      {
        $group: {
          _id: '$_id.game',
          entries: {
            $push: { initials: '$initials', score: '$bestScore' },
          },
        },
      },
      {
        $project: {
          _id: 0,
          game: '$_id',
          entries: { $slice: ['$entries', 10] },
        },
      },
    ];

    const [aggregateRaw, perGameRaw] = await Promise.all([
      col.aggregate(aggregatePipeline).toArray(),
      col.aggregate(perGamePipeline).toArray(),
    ]);

    // Add rank to aggregate
    const aggregate = aggregateRaw.map((p, i) => ({ ...p, rank: i + 1 }));

    // Convert perGame array to map
    const perGame: Record<string, { initials: string; score: number; rank: number }[]> = {};
    for (const { game, entries } of perGameRaw) {
      perGame[game] = entries.map((e: any, i: number) => ({ ...e, rank: i + 1 }));
    }

    // Total unique players (by email or initials)
    const totalPlayers = aggregate.length;

    return NextResponse.json({
      aggregate,
      perGame,
      gameLabels: GAME_LABELS,
      totalPlayers,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[arcade/leaderboard]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
