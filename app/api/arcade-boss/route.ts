import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/escape-html';
import { checkRateLimit } from '@/lib/rate-limit';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  return new Resend(apiKey);
}

const GAME_NAMES: Record<string, string> = {
  asteroids: 'Asteroids',
  frogger: 'Frogger',
  breakout: 'Breakout',
  tron: 'Tron',
  pong: 'Pong',
  snake: 'Serpent Arena',
  invaders: 'Space Invaders',
  galaga: 'Galaga',
  pacman: 'Pac-Man',
};

export async function POST(request: Request) {
  try {
    // Rate limit: 3 boss submissions per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`boss:${ip}`, { maxRequests: 3, windowMs: 60_000 });
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs || 60_000) / 1000)) } }
      );
    }

    const body = await request.json();
    const { email, game, score, initials } = body;

    if (!email || !game) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || email.length > 320 || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Field length validation
    if (typeof game !== 'string' || !GAME_NAMES[game]) {
      return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
    }
    if (initials && (typeof initials !== 'string' || initials.length > 10)) {
      return NextResponse.json({ error: 'Invalid initials' }, { status: 400 });
    }

    const timestamp = new Date();
    const timestampCT = timestamp.toLocaleString('en-US', { timeZone: 'America/Chicago' });
    const rawGameName = GAME_NAMES[game] || game;
    const scoreStr = String(score || 0).padStart(6, '0');
    const rawInitials = initials || '???';

    // Escape user input before interpolation into HTML
    const gameName = escapeHtml(String(rawGameName));
    const playerInitials = escapeHtml(String(rawInitials).slice(0, 10));
    const safeEmail = escapeHtml(String(email));

    // Store in MongoDB
    try {
      const { getDatabase } = await import('@/lib/mongodb');
      const db = await getDatabase();
      await db.collection('arcade_bosses').insertOne({
        email,
        game,
        score: score || 0,
        initials: playerInitials,
        createdAt: timestamp,
      });
    } catch {
      console.warn('arcade-boss: MongoDB unavailable, boss not stored');
    }

    // Send email notifications
    try {
      const recipients = process.env.LEAD_RECIPIENTS?.split(',').map((e) => e.trim()) || [];
      const fromEmail = process.env.RESEND_FROM || 'hello@thestarrconspiracy.com';

      if (recipients.length > 0) {
        const resend = getResendClient();

        const teamHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E1FF00; margin-bottom: 8px;">&#x1F3C6; NEW ARCADE BOSS</h2>
            <p style="color: #FF5910; font-size: 18px; margin-top: 0;">
              Someone just claimed the #1 high score in <strong>${gameName}</strong>.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999; width: 100px;">Player</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff; font-size: 18px; font-weight: bold;">${playerInitials}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Score</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #E1FF00; font-size: 18px; font-family: monospace;">${scoreStr}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Game</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${gameName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #333;"><a href="mailto:${safeEmail}" style="color: #73F5FF;">${safeEmail}</a></td>
              </tr>
            </table>
            <p style="color: #666; font-size: 13px;">
              ${timestampCT} CT
            </p>
            <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              thestarrconspiracy.com &middot; Arcade Boss Alert
            </p>
          </div>
        `;

        const replyHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <p style="font-size: 24px; margin-bottom: 4px;">&#x1F3C6;</p>
            <h2 style="color: #FF5910; margin-top: 0;">You're the Boss.</h2>
            <p>
              Congratulations, <strong>${playerInitials}</strong> &mdash; you just set the all-time high score
              in <strong>${gameName}</strong> with <strong>${scoreStr}</strong> points.
            </p>
            <p>
              Not many people find our arcade, and even fewer claim the top spot. We like that.
            </p>
            <p>
              Someone from our team will be in touch about your prize. In the meantime,
              if you want to talk about leveling up your marketing:
            </p>
            <p style="margin: 24px 0;">
              <a href="https://thestarrconspiracy.com/book"
                 style="background-color: #FF5910; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                Book a Call
              </a>
            </p>
            <p style="margin-top: 32px; color: #666;">&mdash; The Starr Conspiracy</p>
          </div>
        `;

        const emailResults = await Promise.allSettled([
          resend.emails.send({
            from: fromEmail,
            to: recipients,
            subject: `[TSC] New Arcade Boss: ${playerInitials} topped ${gameName} (${scoreStr})`,
            html: teamHtml,
          }),
          resend.emails.send({
            from: fromEmail,
            to: email,
            subject: `You're the Boss of ${gameName}`,
            html: replyHtml,
          }),
        ]);
        emailResults.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.error(`arcade-boss: Email ${i === 0 ? 'team' : 'player'} send failed:`, r.reason);
          }
        });
      }
    } catch (emailError) {
      // Log but don't fail — MongoDB storage is the critical path
      console.error('arcade-boss: Email send failed:', emailError);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
