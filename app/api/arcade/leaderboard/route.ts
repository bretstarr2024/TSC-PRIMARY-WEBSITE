import { NextResponse } from 'next/server';
import { GAME_LABELS, normalizeScore } from '@/lib/arcade/games';

export const revalidate = 30; // ISR — refresh every 30s

export async function GET() {
  try {
    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    const col = db.collection('arcade_scores');

    // ── Aggregate leaderboard: best score per player per game, normalized then summed ──
    // Normalization prevents high-ceiling games (Galaga, Asteroids) from dominating.
    // Each game contributes 0–1000 normalized points to the total (max 10,000 across all 10 games).
    // Per-game leaderboards always show raw scores.
    const bestPerPlayerGamePipeline = [
      { $match: { email: { $exists: true, $nin: [null, ''] }, game: { $ne: 'tsc-fighter' } } },
      // Best raw score per (player, game)
      {
        $group: {
          _id: { player: '$email', game: '$game' },
          bestScore: { $max: '$score' },
          initials: { $first: '$initials' },
        },
      },
    ];

    // ── Per-game top 10 ──
    const perGamePipeline = [
      { $match: { email: { $exists: true, $nin: [null, ''] }, game: { $ne: 'tsc-fighter' } } },
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

    const [bestPerPlayerGame, perGameRaw] = await Promise.all([
      col.aggregate(bestPerPlayerGamePipeline).toArray(),
      col.aggregate(perGamePipeline).toArray(),
    ]);

    // Apply normalization in JS: group by player, sum normalized scores
    const playerMap = new Map<string, {
      initials: string;
      totalScore: number;
      gamesPlayed: number;
      gameBreakdown: { game: string; score: number; normalizedScore: number }[];
    }>();

    for (const { _id, bestScore, initials } of bestPerPlayerGame) {
      const player = _id.player as string;
      const game = _id.game as string;
      const normalized = normalizeScore(game, bestScore as number);

      if (!playerMap.has(player)) {
        playerMap.set(player, { initials, totalScore: 0, gamesPlayed: 0, gameBreakdown: [] });
      }
      const entry = playerMap.get(player)!;
      entry.totalScore += normalized;
      entry.gamesPlayed += 1;
      entry.gameBreakdown.push({ game, score: bestScore as number, normalizedScore: normalized });
    }

    // Sort by normalized total, limit to top 100, add rank
    const aggregate = Array.from(playerMap.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 100)
      .map((p, i) => ({ ...p, rank: i + 1 }));

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
