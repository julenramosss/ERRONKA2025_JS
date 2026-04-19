export interface PendingEmailTemplateParams {
  recipientName: string;
  trackingUrl: string;
}

export const packagePendingTemplate = (
  params: PendingEmailTemplateParams
): string => {
  const { recipientName, trackingUrl } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your package has been received</title>
</head>
<body style="margin:0;padding:0;background-color:#F9F7FA;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F7FA;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(74,53,92,0.15);">

          <!-- Header -->
          <tr>
            <td style="background-color:#7B3FA0;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">PakAG</h1>
              <p style="margin:6px 0 0;color:#F5E6FB;font-size:14px;">Package Delivery Service</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="background-color:#E8F1FB;padding:16px 40px;border-bottom:3px solid #1A5FA8;">
              <p style="margin:0;color:#1A5FA8;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">&#9679; Pending Processing</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#4A355C;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Hello,</p>
              <h2 style="margin:0 0 20px;color:#12081A;font-size:22px;font-weight:700;">${recipientName}</h2>
              <p style="margin:0 0 28px;color:#4A355C;font-size:15px;line-height:1.6;">
                We have received your package and it is currently pending processing.
                Our team will assign it to a distributor shortly and you will receive
                a follow-up email with your personal tracking link.
              </p>

              <!-- Status Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#E8F1FB;border-radius:8px;padding:20px 24px;border-left:4px solid #1A5FA8;">
                    <p style="margin:0 0 4px;color:#1A5FA8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Status</p>
                    <p style="margin:0;color:#12081A;font-size:16px;font-weight:600;">Pending — Awaiting assignment</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}"
                       style="display:inline-block;background-color:#1A5FA8;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                      Track My Package
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#4A355C;font-size:13px;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${trackingUrl}" style="color:#1A5FA8;word-break:break-all;">${trackingUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid rgba(74,53,92,0.15);margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#4A355C;font-size:12px;line-height:1.6;">
                This email was sent automatically. Please do not reply.<br/>
                &copy; ${new Date().getFullYear()} PakAG &mdash; Package Delivery Service
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
