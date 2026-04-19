export interface PackageFailedEmailTemplateParams {
  recipientName: string;
  failedAt: string;
  reason?: string;
}

export function packageFailedEmailTemplate(
  params: PackageFailedEmailTemplateParams
): string {
  const { recipientName, failedAt, reason } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Delivery attempt failed — PakAG</title>
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
            <td style="background-color:#FDEDEC;padding:14px 40px;text-align:center;">
              <p style="margin:0;color:#C0392B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                &#10007;&nbsp; Delivery attempt failed
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#4A355C;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Hello,</p>
              <h2 style="margin:0 0 20px;color:#12081A;font-size:22px;font-weight:700;">${recipientName}</h2>
              <p style="margin:0 0 28px;color:#4A355C;font-size:15px;line-height:1.6;">
                Unfortunately, we were unable to deliver your package. Our delivery driver
                attempted the delivery but could not complete it successfully.
              </p>

              <!-- Info card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:${reason ? "16px" : "28px"};">
                <tr>
                  <td style="background-color:#FDEDEC;border:1px solid rgba(192,57,43,0.2);border-radius:8px;padding:16px;text-align:center;">
                    <p style="margin:0 0 4px;color:#C0392B;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Failed At</p>
                    <p style="margin:0;color:#12081A;font-size:16px;font-weight:700;">${failedAt}</p>
                  </td>
                </tr>
              </table>

              ${
                reason
                  ? `<!-- Reason box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#F9F7FA;border:1px solid rgba(74,53,92,0.15);border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 4px;color:#4A355C;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Reason</p>
                    <p style="margin:0;color:#12081A;font-size:14px;line-height:1.6;">${reason}</p>
                  </td>
                </tr>
              </table>`
                  : ""
              }

              <p style="margin:0;color:#4A355C;font-size:14px;line-height:1.6;">
                Our team will contact you to arrange a new delivery attempt.
                If you have any questions, please reach out to our support team.
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
}
