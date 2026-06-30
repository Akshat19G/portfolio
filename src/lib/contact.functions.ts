import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export const sendContactEmail = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('Email service is not configured');
    }

    const to = 'srivastavaakshat1909@gmail.com';
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">New portfolio message</h2>
        <p><strong>From:</strong> ${escape(data.name)} &lt;${escape(data.email)}&gt;</p>
        <p><strong>Subject:</strong> ${escape(data.subject)}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="white-space:pre-wrap">${escape(data.message)}</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [to],
        reply_to: data.email,
        subject: `[Portfolio] ${data.subject}`,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Resend error:', res.status, text);
      throw new Error('Failed to send email');
    }

    return { ok: true };
  });

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
