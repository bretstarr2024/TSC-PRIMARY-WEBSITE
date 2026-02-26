import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDatabase } from '@/lib/mongodb';
import { escapeHtml } from '@/lib/escape-html';
import { checkRateLimit } from '@/lib/rate-limit';

// Lazy Resend initialization — avoids build-time errors when env var is not set
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

// Field length limits
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_SOURCE_LENGTH = 200;
const MAX_CTAID_LENGTH = 100;

interface LeadData {
  name: string;
  email: string;
  message?: string;
  source?: string;
  ctaId?: string;
}

export async function POST(request: Request) {
  try {
    // Rate limit: 5 submissions per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 });
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs || 60_000) / 1000)) } }
      );
    }

    const data: LeadData = await request.json();

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Field length validation
    if (typeof data.name !== 'string' || data.name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
    }
    if (typeof data.email !== 'string' || data.email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ error: 'Email is too long' }, { status: 400 });
    }
    if (data.message && (typeof data.message !== 'string' || data.message.length > MAX_MESSAGE_LENGTH)) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }
    if (data.source && (typeof data.source !== 'string' || data.source.length > MAX_SOURCE_LENGTH)) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }
    if (data.ctaId && (typeof data.ctaId !== 'string' || data.ctaId.length > MAX_CTAID_LENGTH)) {
      return NextResponse.json({ error: 'Invalid ctaId' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const recipients = process.env.LEAD_RECIPIENTS?.split(',').map((e) => e.trim()) || [];
    const fromEmail = process.env.RESEND_FROM || 'hello@thestarrconspiracy.com';

    if (recipients.length === 0) {
      console.error('No LEAD_RECIPIENTS configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const timestamp = new Date();
    const timestampCT = timestamp.toLocaleString('en-US', { timeZone: 'America/Chicago' });

    // Store lead in MongoDB
    try {
      const db = await getDatabase();
      await db.collection('leads').insertOne({
        name: data.name,
        email: data.email,
        message: data.message || null,
        source: data.source || null,
        ctaId: data.ctaId || null,
        timestamp,
        userAgent: request.headers.get('user-agent') || null,
      });
    } catch (dbError) {
      // Log but don't fail — email is the critical path
      console.error('Failed to store lead in MongoDB:', dbError);
    }

    // Escape user input before interpolation into HTML
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeMessage = data.message ? escapeHtml(data.message) : '';
    const safeSource = data.source ? escapeHtml(data.source) : '';
    const safeCtaId = data.ctaId ? escapeHtml(data.ctaId) : '';

    // Team notification email
    const teamHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5910; margin-bottom: 20px;">New Lead</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999; width: 100px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333;"><a href="mailto:${safeEmail}" style="color: #73F5FF;">${safeEmail}</a></td>
          </tr>
          ${data.message ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safeMessage}</td>
          </tr>
          ` : ''}
          ${data.source ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">Source</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safeSource}</td>
          </tr>
          ` : ''}
          ${data.ctaId ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-weight: bold; color: #999;">CTA</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; color: #fff;">${safeCtaId}</td>
          </tr>
          ` : ''}
        </table>
        <p style="color: #666; font-size: 13px;">
          Submitted: ${timestampCT} CT
        </p>
        <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          thestarrconspiracy.com
        </p>
      </div>
    `;

    // Auto-reply to submitter
    const replyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <p>Hey ${safeName},</p>
        <p>Thanks for reaching out. Someone from our team will be in touch within one business day.</p>
        <p>If you'd rather skip the wait and book a call now:</p>
        <p style="margin: 24px 0;">
          <a href="https://thestarrconspiracy.com/book"
             style="background-color: #FF5910; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
            Book a Call
          </a>
        </p>
        <p style="margin-top: 32px; color: #666;">&mdash; The Starr Conspiracy</p>
      </div>
    `;

    const resend = getResendClient();

    // Send both emails in parallel — allSettled so one failure doesn't block the other
    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: recipients,
        subject: `[TSC] New lead: ${safeName} (${safeEmail})`,
        html: teamHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: 'We got your message',
        html: replyHtml,
      }),
    ]);

    // Log individual failures but still return success (lead is already stored)
    emailResults.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Lead email ${i === 0 ? 'team notification' : 'auto-reply'} failed:`, r.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
