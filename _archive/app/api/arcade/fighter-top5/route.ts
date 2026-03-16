/**
 * POST /api/arcade/fighter-top5
 * Fetches top 5 TSC Fighter scores (by email) and sends each player a personalized email.
 * Dashboard-only — requires tsc_dash session cookie.
 *
 * Usage:
 *   curl -X POST https://your-domain.com/api/arcade/fighter-top5 \
 *     -H "Cookie: tsc_dash=<session>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"subject":"You made the TSC Fighter leaderboard","preview":true}'
 *
 * Body params:
 *   subject    — optional email subject override
 *   preview    — if true, returns what would be sent without actually sending
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDatabase } from '@/lib/mongodb';
import { verifyDashboardSession } from '@/lib/dashboard-auth';

export const revalidate = 0;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not set');
  return new Resend(key);
}

const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];

function buildHtml(rank: number, initials: string, score: number): string {
  const rankLabel = RANK_LABELS[rank] ?? `${rank + 1}th`;
  const color = rank === 0 ? '#E1FF00' : rank === 1 ? '#73F5FF' : '#FF5910';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050508;font-family:'Courier New',monospace;color:#d1d1c6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <tr><td>
      <!-- Header -->
      <p style="font-size:11px;color:#555;letter-spacing:0.2em;margin:0 0 20px;">THE STARR CONSPIRACY</p>
      <h1 style="font-size:32px;color:${color};margin:0 0 8px;text-shadow:0 0 30px ${color}66;">${rankLabel.toUpperCase()} PLACE</h1>
      <h2 style="font-size:18px;color:#fff;margin:0 0 32px;font-weight:normal;">TSC FIGHTER LEADERBOARD</h2>

      <!-- Score block -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${color}44;background:${color}08;margin-bottom:32px;">
        <tr><td style="padding:24px 28px;">
          <p style="font-size:10px;color:#555;margin:0 0 8px;letter-spacing:0.15em;">PLAYER</p>
          <p style="font-size:28px;color:${color};margin:0 0 20px;">${initials}</p>
          <p style="font-size:10px;color:#555;margin:0 0 8px;letter-spacing:0.15em;">FINAL SCORE</p>
          <p style="font-size:36px;color:#fff;margin:0;">${score.toLocaleString()}</p>
        </td></tr>
      </table>

      <!-- Body copy -->
      <p style="font-size:13px;line-height:1.8;color:#d1d1c6;margin:0 0 16px;">
        You made it to the top 5 in TSC Fighter — our hidden arcade game.
        Not many people even find it. You did, and you played it well.
      </p>
      <p style="font-size:13px;line-height:1.8;color:#d1d1c6;margin:0 0 32px;">
        The game is a microcosm of what we believe about go-to-market:
        the biggest obstacles aren't competitors — they're misaligned strategy,
        broken pipeline, and AI that doesn't actually work.
        Sound familiar? That's the GTM Kernel's whole reason for existing.
      </p>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
        <tr><td style="background:transparent;border:2px solid ${color};padding:14px 32px;">
          <a href="https://thestarrconspiracy.com/solve" style="color:${color};text-decoration:none;font-size:12px;letter-spacing:0.1em;">SEE THE GTM KERNEL →</a>
        </td></tr>
      </table>

      <!-- Footer -->
      <p style="font-size:10px;color:#333;border-top:1px solid #1a1a2a;padding-top:20px;margin:0;">
        The Starr Conspiracy · B2B Marketing · thestarrconspiracy.com
      </p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function POST(request: NextRequest) {
  if (!await verifyDashboardSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { subject?: string; preview?: boolean } = {};
  try { body = await request.json(); } catch { /* no body */ }

  const subject = body.subject ?? 'You made the TSC Fighter leaderboard';
  const preview = body.preview === true;

  try {
    const db = await getDatabase();

    // Best score per unique email for tsc-fighter, top 5
    const top5 = await db.collection('arcade_scores').aggregate([
      { $match: { game: 'tsc-fighter', email: { $exists: true, $nin: [null, ''] } } },
      { $group: { _id: '$email', bestScore: { $max: '$score' }, initials: { $first: '$initials' } } },
      { $sort: { bestScore: -1 } },
      { $limit: 5 },
    ]).toArray();

    if (top5.length === 0) {
      return NextResponse.json({ message: 'No TSC Fighter scores with emails found', sent: 0 });
    }

    if (preview) {
      return NextResponse.json({
        preview: true,
        recipients: top5.map((p, i) => ({
          rank: i + 1,
          email: p._id,
          initials: p.initials,
          score: p.bestScore,
          subject,
        })),
      });
    }

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM ?? 'hello@thestarrconspiracy.com';
    const results: { email: string; rank: number; ok: boolean; id?: string; error?: string }[] = [];

    for (let i = 0; i < top5.length; i++) {
      const { _id: email, bestScore, initials } = top5[i];
      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: email as string,
          subject,
          html: buildHtml(i, initials as string, bestScore as number),
        });
        results.push({ email: email as string, rank: i + 1, ok: !error, id: data?.id, error: error?.message });
      } catch (err) {
        results.push({ email: email as string, rank: i + 1, ok: false, error: String(err) });
      }
    }

    return NextResponse.json({
      sent: results.filter(r => r.ok).length,
      total: results.length,
      results,
    });
  } catch (err) {
    console.error('[arcade/fighter-top5]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
