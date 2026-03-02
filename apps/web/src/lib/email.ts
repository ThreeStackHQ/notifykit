import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface SendNotificationEmailOptions {
  to: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  category?: string;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    info: '#0d9488',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
  };
  return colors[category] ?? colors['info']!;
}

export async function sendNotificationEmail({
  to,
  title,
  body,
  actionUrl,
  category = 'info',
}: SendNotificationEmailOptions): Promise<void> {
  const resend = getResend();
  const color = getCategoryColor(category);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
        <tr><td style="background:${color};padding:24px 32px;">
          <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">NotifyKit</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <span style="display:inline-block;background:${color}22;color:${color};font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px">${category}</span>
          <h1 style="margin:16px 0 8px;font-size:22px;color:#111;">${title}</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">${body}</p>
          ${actionUrl ? `<a href="${actionUrl}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">View Details</a>` : ''}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
          <p style="margin:0;font-size:12px;color:#aaa;">You received this email because your app uses NotifyKit. <a href="#" style="color:#0d9488;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from: 'notifications@notifykit.threestack.io',
    to,
    subject: `[${category.toUpperCase()}] ${title}`,
    html,
  });
}
