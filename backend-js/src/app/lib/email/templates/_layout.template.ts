import { theme } from "./_theme";

export interface EmailInfoCard {
  label: string;
  value: string;
  accent?: string;
}

export interface EmailCta {
  label: string;
  url: string;
  fallbackHint?: string;
}

export interface EmailStatusBadge {
  label: string;
  fg: string;
  bg: string;
}

export interface EmailLayoutParams {
  title: string;
  preheader: string;
  statusBadge: EmailStatusBadge;
  greetingLabel?: string;
  greetingName: string;
  headline: string;
  paragraphs: string[];
  infoCards?: EmailInfoCard[];
  cta?: EmailCta;
  secondaryNote?: string;
  footerLines?: string[];
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSingleCard(card: EmailInfoCard): string {
  const accent = card.accent ?? theme.accent.light;

  return `
    <tr>
      <td style="padding:0 0 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:${theme.bg.surface};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};">
          <tr>
            <td style="width:5px;background-color:${accent};border-radius:${theme.radius.lg} 0 0 ${theme.radius.lg};font-size:0;line-height:0;">&nbsp;</td>
            <td style="padding:16px 18px;">
              <p style="margin:0 0 6px;color:${accent};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(card.label)}</p>
              <p style="margin:0;color:${theme.text.primary};font-size:15px;font-weight:600;line-height:1.5;font-family:${theme.font};word-break:break-word;">${escapeHtml(card.value)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderInfoCards(cards: EmailInfoCard[]): string {
  if (cards.length === 2) {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 18px;">
        <tr>
          <td valign="top" width="50%" style="padding-right:6px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              ${renderSingleCard(cards[0])}
            </table>
          </td>
          <td valign="top" width="50%" style="padding-left:6px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              ${renderSingleCard(cards[1])}
            </table>
          </td>
        </tr>
      </table>`;
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 18px;">
      ${cards.map((card) => renderSingleCard(card)).join("")}
    </table>`;
}

function renderCta(cta: EmailCta): string {
  const fallbackHint =
    cta.fallbackHint ??
    "Botoiak ez badu funtzionatzen, kopiatu eta itsatsi esteka hau zure nabigatzailean:";

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:8px 0 28px;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
              <td style="background:linear-gradient(135deg, ${theme.accent.light} 0%, ${theme.accent.primary} 58%, ${theme.accent.hover} 100%);border-radius:${theme.radius.pill};box-shadow:${theme.shadow.glow};">
                <a href="${cta.url}" style="display:inline-block;padding:15px 34px;color:${theme.text.onAccent};text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.2px;font-family:${theme.font};border-radius:${theme.radius.pill};">
                  ${escapeHtml(cta.label)} &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-top:18px;">
          <p style="margin:0;color:${theme.text.muted};font-size:12px;line-height:1.7;font-family:${theme.font};">
            ${escapeHtml(fallbackHint)}<br />
            <a href="${cta.url}" style="color:${theme.accent.light};word-break:break-all;text-decoration:underline;">${escapeHtml(cta.url)}</a>
          </p>
        </td>
      </tr>
    </table>`;
}

export function renderEmailLayout(params: EmailLayoutParams): string {
  const {
    title,
    preheader,
    statusBadge,
    greetingLabel = "Kaixo,",
    greetingName,
    headline,
    paragraphs,
    infoCards,
    cta,
    secondaryNote,
    footerLines,
  } = params;

  const year = new Date().getFullYear();
  const defaultFooter = [
    "Mezu hau automatikoki bidali da. Mesedez, ez erantzun helbide honetara.",
    `&copy; ${year} PakAG - Tolosako banaketa zerbitzua`,
  ];
  const footer = footerLines ?? defaultFooter;

  const paragraphsHtml = paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:${theme.text.secondary};font-size:15px;line-height:1.75;font-family:${theme.font};">${paragraph}</p>`
    )
    .join("");

  const infoCardsHtml =
    infoCards && infoCards.length > 0 ? renderInfoCards(infoCards) : "";
  const ctaHtml = cta ? renderCta(cta) : "";
  const secondaryNoteHtml = secondaryNote
    ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 8px;">
         <tr>
           <td style="padding:16px 18px;background-color:${theme.bg.surface};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};">
             <p style="margin:0;color:${theme.text.secondary};font-size:13px;line-height:1.7;font-family:${theme.font};">${secondaryNote}</p>
           </td>
         </tr>
       </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="eu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark only" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${theme.bg.darkest};font-family:${theme.font};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;visibility:hidden;">
    ${escapeHtml(preheader)}
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:${theme.bg.darkest};padding:28px 12px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;max-width:640px;background-color:${theme.bg.dark};border:1px solid ${theme.border.strong};border-radius:${theme.radius.xl};overflow:hidden;box-shadow:${theme.shadow.card};">
          <tr>
            <td style="height:6px;font-size:0;line-height:0;background:linear-gradient(90deg, ${theme.accent.light} 0%, ${theme.accent.primary} 58%, ${statusBadge.fg} 100%);">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:30px 32px;background:radial-gradient(circle at top right, rgba(167,139,250,0.22) 0%, rgba(167,139,250,0) 34%), linear-gradient(135deg, ${theme.bg.surface} 0%, ${theme.bg.dark} 60%, ${theme.bg.elevated} 100%);border-bottom:1px solid ${theme.border.normal};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td valign="top">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding:10px 14px;background-color:${theme.accent.primary};border-radius:${theme.radius.md};">
                          <span style="display:inline-block;color:${theme.text.onAccent};font-size:18px;font-weight:800;letter-spacing:-0.3px;font-family:${theme.font};">PakAG</span>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;color:${theme.text.secondary};font-size:12px;line-height:1.5;font-family:${theme.font};">Tolosa eta inguruko banaketak</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding:8px 14px;background-color:${statusBadge.bg};border:1px solid ${statusBadge.fg}33;border-radius:${theme.radius.pill};">
                          <p style="margin:0;color:${statusBadge.fg};font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(statusBadge.label)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:28px;">
                    <p style="margin:0 0 10px;color:${theme.text.muted};font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;font-family:${theme.font};">PakAG jakinarazpena</p>
                    <h1 style="margin:0 0 12px;color:${theme.text.primary};font-size:30px;line-height:1.2;font-weight:800;letter-spacing:-0.7px;font-family:${theme.font};">${escapeHtml(headline)}</h1>
                    <p style="margin:0;max-width:500px;color:${theme.text.secondary};font-size:15px;line-height:1.7;font-family:${theme.font};">${escapeHtml(preheader)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 32px 18px;">
              <p style="margin:0 0 4px;color:${theme.text.muted};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(greetingLabel)}</p>
              <h2 style="margin:0 0 20px;color:${theme.text.primary};font-size:22px;font-weight:700;line-height:1.25;font-family:${theme.font};">${escapeHtml(greetingName)}</h2>
              ${paragraphsHtml}
              ${infoCardsHtml}
              ${ctaHtml}
              ${secondaryNoteHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background:linear-gradient(90deg, transparent 0%, ${theme.border.normal} 20%, ${theme.border.normal} 80%, transparent 100%);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px 28px;text-align:center;">
              ${footer
                .map(
                  (line) =>
                    `<p style="margin:0 0 4px;color:${theme.text.muted};font-size:11px;line-height:1.7;font-family:${theme.font};">${line}</p>`
                )
                .join("")}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
