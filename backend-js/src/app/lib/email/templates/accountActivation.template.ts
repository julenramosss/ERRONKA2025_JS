export interface AccountActivationTemplateParams {
  recipientName: string;
  activationUrl: string;
}

export const accountActivationTemplate = (
  params: AccountActivationTemplateParams
): string => {
  const { recipientName, activationUrl } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Activate your PakAG account</title>
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

          <!-- Status banner -->
          <tr>
            <td style="background-color:#EAF6F0;padding:14px 40px;text-align:center;">
              <p style="margin:0;color:#1A7A4A;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                &#127881;&nbsp; Welcome — Activate your account
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#4A355C;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Hello,</p>
              <h2 style="margin:0 0 20px;color:#12081A;font-size:22px;font-weight:700;">${recipientName}</h2>
              <p style="margin:0 0 28px;color:#4A355C;font-size:15px;line-height:1.6;">
                Your PakAG account has been created. Click the button below to set your password and activate your account.
                This link will expire in <strong>7 days</strong>.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${activationUrl}"
                       style="display:inline-block;background-color:#7B3FA0;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                      Activate My Account
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#F0EAF7;border:1px solid rgba(123,63,160,0.2);border-radius:8px;padding:16px 20px;">
                    <p style="margin:0;color:#4A355C;font-size:13px;line-height:1.6;">
                      <strong>Did not expect this email?</strong> If you were not expecting an account invitation, please contact your administrator.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#4A355C;font-size:13px;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${activationUrl}" style="color:#7B3FA0;word-break:break-all;">${activationUrl}</a>
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
