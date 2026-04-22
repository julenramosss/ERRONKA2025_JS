export interface PackageUndeliveredEmailTemplateParams {
  recipientName: string;
  attemptedAt: string;
}

export function packageUndeliveredTemplate(
  params: PackageUndeliveredEmailTemplateParams
): string {
  const { recipientName, attemptedAt } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Delivery not completed today — PakAG</title>
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
            <td style="background-color:#FEF9EC;padding:14px 40px;text-align:center;">
              <p style="margin:0;color:#D68910;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                &#9888;&nbsp; Delivery not completed today
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#4A355C;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Hello,</p>
              <h2 style="margin:0 0 20px;color:#12081A;font-size:22px;font-weight:700;">${recipientName}</h2>
              <p style="margin:0 0 28px;color:#4A355C;font-size:15px;line-height:1.6;">
                We were unable to complete the delivery of your package today.
                Do not worry — your package is safe and will be rescheduled for delivery on another day.
              </p>

              <!-- Info card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#FEF9EC;border:1px solid rgba(214,137,16,0.25);border-radius:8px;padding:16px;text-align:center;">
                    <p style="margin:0 0 4px;color:#D68910;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Attempted At</p>
                    <p style="margin:0;color:#12081A;font-size:16px;font-weight:700;">${attemptedAt}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#4A355C;font-size:14px;line-height:1.6;">
                Our team will automatically schedule a new delivery attempt on the next available route.
                You do not need to take any action.
              </p>
              <p style="margin:0;color:#4A355C;font-size:14px;line-height:1.6;">
                If you have any questions, please reach out to our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F9F7FA;padding:24px 40px;text-align:center;border-top:1px solid rgba(74,53,92,0.1);">
              <p style="margin:0;color:#9B8AAD;font-size:12px;">
                &copy; 2026 PakAG &mdash; Package Delivery Service
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
