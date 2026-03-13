import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDatabase } from '@/lib/mongodb';
import { escapeHtml } from '@/lib/escape-html';
import { checkRateLimit } from '@/lib/rate-limit';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY environment variable is not set');
  return new Resend(apiKey);
}

const MAX_FIELD = 200;
const MAX_EMAIL = 320;
const MAX_TEXT = 2000;

interface GameOverLead {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  competitors: string;
  aiEngine: string;
  seedTopic: string;
}

function validateString(val: unknown, max: number): val is string {
  return typeof val === 'string' && val.length > 0 && val.length <= max;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 });
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs || 60_000) / 1000)) } }
      );
    }

    const data: GameOverLead = await request.json();

    if (!validateString(data.firstName, MAX_FIELD)) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!validateString(data.lastName, MAX_FIELD)) {
      return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
    }
    if (!validateString(data.email, MAX_EMAIL)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!validateString(data.company, MAX_FIELD)) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    if (!validateString(data.title, MAX_FIELD)) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!validateString(data.competitors, MAX_TEXT)) {
      return NextResponse.json({ error: 'Competitors are required' }, { status: 400 });
    }
    if (!validateString(data.aiEngine, MAX_FIELD)) {
      return NextResponse.json({ error: 'AI engine selection is required' }, { status: 400 });
    }
    if (!validateString(data.seedTopic, MAX_TEXT)) {
      return NextResponse.json({ error: 'Seed topic is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const recipients = process.env.LEAD_RECIPIENTS?.split(',').map((e) => e.trim()) || [];
    const fromEmail = process.env.RESEND_FROM || 'hello@thestarrconspiracy.com';

    if (recipients.length === 0) {
      console.error('No LEAD_RECIPIENTS configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const timestamp = new Date();
    const timestampCT = timestamp.toLocaleString('en-US', { timeZone: 'America/Chicago' });

    // Store in MongoDB
    try {
      const db = await getDatabase();

      const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
      const recent = await db.collection('leads').findOne({
        email: data.email,
        source: 'gameover',
        timestamp: { $gte: fiveMinAgo },
      });
      if (recent) {
        return NextResponse.json({ ok: true });
      }

      await db.collection('leads').insertOne({
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.company,
        title: data.title,
        competitors: data.competitors,
        aiEngine: data.aiEngine,
        seedTopic: data.seedTopic,
        source: 'gameover',
        ctaId: 'gameover-form',
        timestamp,
        userAgent: request.headers.get('user-agent') || null,
      });
    } catch (dbError) {
      console.error('Failed to store gameover lead in MongoDB:', dbError);
    }

    const safe = {
      firstName: escapeHtml(data.firstName),
      lastName: escapeHtml(data.lastName),
      email: escapeHtml(data.email),
      company: escapeHtml(data.company),
      title: escapeHtml(data.title),
      competitors: escapeHtml(data.competitors),
      aiEngine: escapeHtml(data.aiEngine),
      seedTopic: escapeHtml(data.seedTopic),
    };

    const teamHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5910; margin-bottom: 20px;">New Game Over Landing Page Entry</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999; width: 120px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safe.firstName} ${safe.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333;"><a href="mailto:${safe.email}" style="color: #73F5FF;">${safe.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safe.company}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Title</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safe.title}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999; vertical-align: top;">Competitors</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safe.competitors}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">AI Engine</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safe.aiEngine}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999; vertical-align: top;">Seed Topic</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safe.seedTopic}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 13px;">Submitted: ${timestampCT} CT</p>
        <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">thestarrconspiracy.com/game-over</p>
      </div>
    `;

    const replyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <p>Hey ${safe.firstName},</p>
        <p>You're in. Game on.</p>
        <p>We'll follow up within 48 hours to schedule your 30-minute walkthrough. Real data. Real analysis. Your competitors. Your market.</p>
        <p>No credit card. No auto-renewal.</p>
        <p>In the meantime, take a look around <a href="https://thestarrconspiracy.com" style="color: #FF5910;">thestarrconspiracy.com</a>. We built the whole thing in a day. That's not a metaphor.</p>
        <p style="margin-top: 32px; color: #666;">The Starr Conspiracy</p>
      </div>
    `;

    const resend = getResendClient();

    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: recipients,
        subject: `[TSC] Game Over entry: ${safe.firstName} ${safe.lastName} (${safe.company})`,
        html: teamHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "You're in. Game on.",
        html: replyHtml,
      }),
    ]);

    emailResults.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Gameover email ${i === 0 ? 'team notification' : 'auto-reply'} failed:`, r.reason);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Gameover lead submission error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
