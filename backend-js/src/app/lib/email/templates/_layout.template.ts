import { theme } from './_theme';
import type {
  EmailCta,
  EmailInfoCard,
  EmailLayoutParams,
  EmailProgressStep,
} from './types';

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// PakAG package icon (matches PackLogo.tsx)
const PAKAG_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;

function renderProgressSteps(steps: EmailProgressStep[]): string {
  const stepWidth = `${Math.floor(100 / steps.length)}%`;

  const stepCells = steps
    .map((step) => {
      const isCompleted = step.status === 'completed';
      const isCurrent = step.status === 'current';
      const isError = step.status === 'error';

      let dotBorder: string;
      let dotBg: string;
      let labelColor: string;
      let fontWeight: string;
      let dotInner: string;

      if (isCompleted) {
        dotBorder = theme.status.delivered.fg;
        dotBg = theme.status.delivered.bg;
        labelColor = theme.text.secondary;
        fontWeight = '500';
        dotInner = `<span style="display:inline-block;color:${theme.status.delivered.fg};font-size:14px;font-weight:700;line-height:1;">&#10003;</span>`;
      } else if (isCurrent) {
        dotBorder = theme.accent.light;
        dotBg = theme.accent.subtle;
        labelColor = theme.text.primary;
        fontWeight = '700';
        dotInner = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${theme.accent.light};"></span>`;
      } else if (isError) {
        dotBorder = theme.status.failed.fg;
        dotBg = theme.status.failed.bg;
        labelColor = theme.status.failed.fg;
        fontWeight = '600';
        dotInner = `<span style="display:inline-block;color:${theme.status.failed.fg};font-size:14px;font-weight:700;line-height:1;">&#10007;</span>`;
      } else {
        dotBorder = theme.border.normal;
        dotBg = theme.bg.elevated;
        labelColor = theme.text.muted;
        fontWeight = '400';
        dotInner = `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${theme.border.normal};"></span>`;
      }

      const glowStyle = isCurrent
        ? `box-shadow:0 0 14px ${theme.accent.light}55;`
        : isError
          ? `box-shadow:0 0 10px ${theme.status.failed.fg}44;`
          : '';

      return `
      <td align="center" valign="top" style="width:${stepWidth};padding:0 3px;">
        <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 auto;">
          <tr>
            <td align="center" valign="middle"
              style="width:32px;height:32px;border-radius:50%;background:${dotBg};border:2px solid ${dotBorder};${glowStyle}font-size:0;">
              ${dotInner}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:9px;">
              <p style="margin:0;color:${labelColor};font-size:10px;font-weight:${fontWeight};font-family:${theme.font};letter-spacing:0.2px;line-height:1.3;">${escapeHtml(step.label)}</p>
            </td>
          </tr>
        </table>
      </td>`;
    })
    .join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 28px;">
      <tr>
        <td style="padding:18px 14px 20px;background:${theme.bg.surface};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};">
          <p style="margin:0 0 14px;color:${theme.text.muted};font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;font-family:${theme.font};">Bidalketaren egoera</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>${stepCells}</tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function renderSingleCard(card: EmailInfoCard): string {
  const accent = card.accent ?? theme.accent.light;
  return `
    <tr>
      <td style="padding:0 0 10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
          style="background:${theme.bg.elevated};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};overflow:hidden;">
          <tr>
            <td style="width:4px;background:${accent};font-size:0;line-height:0;">&nbsp;</td>
            <td style="padding:14px 18px;">
              <p style="margin:0 0 5px;color:${accent};font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(card.label)}</p>
              <p style="margin:0;color:${theme.text.primary};font-size:15px;font-weight:600;line-height:1.45;font-family:${theme.font};word-break:break-word;">${escapeHtml(card.value)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderInfoCards(cards: EmailInfoCard[]): string {
  if (cards.length === 2) {
    const c0accent = cards[0].accent ?? theme.accent.light;
    const c1accent = cards[1].accent ?? theme.accent.light;
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 20px;">
        <tr>
          <td class="em-card-half" valign="top" width="50%" style="padding-right:5px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="background:${theme.bg.elevated};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};overflow:hidden;">
              <tr>
                <td style="width:4px;background:${c0accent};font-size:0;">&nbsp;</td>
                <td style="padding:14px 16px;">
                  <p style="margin:0 0 5px;color:${c0accent};font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(cards[0].label)}</p>
                  <p style="margin:0;color:${theme.text.primary};font-size:14px;font-weight:600;line-height:1.45;font-family:${theme.font};word-break:break-word;">${escapeHtml(cards[0].value)}</p>
                </td>
              </tr>
            </table>
          </td>
          <td class="em-card-half" valign="top" width="50%" style="padding-left:5px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="background:${theme.bg.elevated};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};overflow:hidden;">
              <tr>
                <td style="width:4px;background:${c1accent};font-size:0;">&nbsp;</td>
                <td style="padding:14px 16px;">
                  <p style="margin:0 0 5px;color:${c1accent};font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(cards[1].label)}</p>
                  <p style="margin:0;color:${theme.text.primary};font-size:14px;font-weight:600;line-height:1.45;font-family:${theme.font};word-break:break-word;">${escapeHtml(cards[1].value)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 20px;">
      ${cards.map((card) => renderSingleCard(card)).join('')}
    </table>`;
}

function renderCta(cta: EmailCta): string {
  const fallbackHint =
    cta.fallbackHint ??
    'Botoiak ez badu funtzionatzen, kopiatu eta itsatsi esteka hau zure nabigatzailean:';

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:4px 0 28px;">
      <tr>
        <td align="center" style="padding-bottom:18px;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
              <td style="border-radius:${theme.radius.pill};background:linear-gradient(135deg,${theme.accent.light} 0%,${theme.accent.primary} 55%,${theme.accent.hover} 100%);box-shadow:0 8px 32px rgba(124,58,237,0.38),0 2px 8px rgba(0,0,0,0.4);">
                <a href="${cta.url}" class="em-cta"
                  style="display:inline-block;padding:16px 44px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.3px;font-family:${theme.font};border-radius:${theme.radius.pill};">
                  ${escapeHtml(cta.label)}&nbsp;&rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding:14px 20px;background:${theme.bg.surface};border:1px solid ${theme.border.normal};border-radius:${theme.radius.lg};">
          <p style="margin:0 0 6px;color:${theme.text.muted};font-size:11px;line-height:1.6;font-family:${theme.font};">${escapeHtml(fallbackHint)}</p>
          <a href="${cta.url}"
            style="color:${theme.accent.light};font-size:11px;text-decoration:underline;word-break:break-all;font-family:${theme.font};">${escapeHtml(cta.url)}</a>
        </td>
      </tr>
    </table>`;
}

export function renderEmailLayout(params: EmailLayoutParams): string {
  const {
    title,
    preheader,
    statusBadge,
    greetingLabel = 'Kaixo,',
    greetingName,
    headline,
    paragraphs,
    infoCards,
    cta,
    secondaryNote,
    footerLines,
    progressSteps,
    heroIconSvg,
  } = params;

  const year = new Date().getFullYear();
  const defaultFooter = [
    'Mezu hau automatikoki bidali da. Mesedez, ez erantzun helbide honetara.',
    `&copy; ${year} PakAG &mdash; Tolosako banaketa zerbitzua`,
  ];
  const footer = footerLines ?? defaultFooter;

  const paragraphsHtml = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;color:${theme.text.secondary};font-size:15px;line-height:1.8;font-family:${theme.font};">${p}</p>`
    )
    .join('');

  const infoCardsHtml =
    infoCards && infoCards.length > 0 ? renderInfoCards(infoCards) : '';
  const ctaHtml = cta ? renderCta(cta) : '';
  const progressHtml =
    progressSteps && progressSteps.length > 0
      ? renderProgressSteps(progressSteps)
      : '';

  const heroIconHtml = heroIconSvg
    ? `
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 auto 24px;">
      <tr>
        <td align="center" valign="middle"
          style="width:68px;height:68px;border-radius:50%;background:${statusBadge.bg};border:2px solid ${statusBadge.fg}55;box-shadow:0 0 48px ${statusBadge.fg}30,0 0 0 8px ${statusBadge.fg}12;">
          ${heroIconSvg}
        </td>
      </tr>
    </table>`
    : '';

  const secondaryNoteHtml = secondaryNote
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:4px 0 8px;">
      <tr>
        <td style="padding:14px 18px;background:${theme.bg.surface};border:1px solid ${theme.border.normal};border-left:3px solid ${theme.accent.subtle};border-radius:${theme.radius.lg};">
          <p style="margin:0;color:${theme.text.secondary};font-size:13px;line-height:1.75;font-family:${theme.font};">${secondaryNote}</p>
        </td>
      </tr>
    </table>`
    : '';

  const footerHtml = footer
    .map(
      (line) =>
        `<p style="margin:0 0 4px;color:${theme.text.muted};font-size:11px;line-height:1.7;font-family:${theme.font};">${line}</p>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="eu">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta name="color-scheme" content="dark only"/>
  <meta name="supported-color-schemes" content="dark only"/>
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width:600px){
      .em-wrapper{width:100%!important;}
      .em-hero{padding:32px 20px!important;}
      .em-header{padding:16px 20px!important;}
      .em-body{padding:28px 20px!important;}
      .em-footer{padding:18px 20px 24px!important;}
      .em-h1{font-size:24px!important;line-height:1.3!important;}
      .em-h2{font-size:18px!important;}
      .em-card-half{display:block!important;width:100%!important;padding-right:0!important;padding-left:0!important;padding-bottom:10px!important;}
      .em-cta{padding:15px 28px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${theme.bg.darkest};font-family:${theme.font};-webkit-font-smoothing:antialiased;">

  <!-- Preheader hidden text (padded to prevent client showing next text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;color:transparent;visibility:hidden;">
    ${escapeHtml(preheader)}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
    style="background-color:${theme.bg.darkest};padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- EMAIL CONTAINER -->
        <table class="em-wrapper" width="600" cellpadding="0" cellspacing="0" border="0" role="presentation"
          style="width:100%;max-width:600px;">

          <!-- TOP GRADIENT ACCENT STRIPE -->
          <tr>
            <td style="height:4px;font-size:0;line-height:0;
              background:linear-gradient(90deg,${theme.accent.light} 0%,${theme.accent.primary} 45%,${statusBadge.fg} 100%);
              border-radius:16px 16px 0 0;"></td>
          </tr>

          <!-- HEADER: Logo + Status badge -->
          <tr>
            <td class="em-header" style="padding:18px 28px;
              background:${theme.bg.surface};
              border-left:1px solid ${theme.border.strong};
              border-right:1px solid ${theme.border.strong};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td align="center" valign="middle"
                          style="width:32px;height:32px;border-radius:8px;
                            background:linear-gradient(135deg,${theme.accent.light} 0%,${theme.accent.primary} 55%,#4c1d95 100%);
                            box-shadow:0 4px 14px rgba(124,58,237,0.45);">
                          ${PAKAG_ICON_SVG}
                        </td>
                        <td style="padding-left:10px;">
                          <p style="margin:0;font-size:16px;font-weight:800;color:${theme.text.primary};
                            letter-spacing:-0.3px;font-family:${theme.font};">pak<span style="color:${theme.accent.light};">AG</span></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding:7px 16px;
                          background:${statusBadge.bg};
                          border:1px solid ${statusBadge.fg}44;
                          border-radius:${theme.radius.pill};">
                          <p style="margin:0;color:${statusBadge.fg};font-size:10px;font-weight:700;
                            letter-spacing:1.3px;text-transform:uppercase;
                            font-family:${theme.font};white-space:nowrap;">${escapeHtml(statusBadge.label)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO SECTION -->
          <tr>
            <td class="em-hero" style="padding:44px 32px 40px;text-align:center;
              background:
                radial-gradient(ellipse 70% 55% at 50% 0%,${statusBadge.fg}1a 0%,transparent 65%),
                radial-gradient(ellipse 50% 35% at 90% 100%,rgba(124,58,237,0.12) 0%,transparent 55%),
                radial-gradient(ellipse 40% 30% at 10% 80%,rgba(167,139,250,0.07) 0%,transparent 50%),
                ${theme.bg.dark};
              border-left:1px solid ${theme.border.strong};
              border-right:1px solid ${theme.border.strong};">

              ${heroIconHtml}

              <p style="margin:0 0 10px;color:${theme.text.muted};font-size:10px;font-weight:700;
                letter-spacing:1.5px;text-transform:uppercase;font-family:${theme.font};">PakAG jakinarazpena</p>

              <h1 class="em-h1" style="margin:0 0 14px;color:${theme.text.primary};font-size:28px;
                font-weight:800;line-height:1.2;letter-spacing:-0.5px;font-family:${theme.font};">
                ${escapeHtml(headline)}
              </h1>

              <p style="margin:0 auto;max-width:460px;color:${theme.text.secondary};font-size:15px;
                line-height:1.75;font-family:${theme.font};">${escapeHtml(preheader)}</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td class="em-body" style="padding:32px 28px 28px;
              background:${theme.bg.dark};
              border-left:1px solid ${theme.border.strong};
              border-right:1px solid ${theme.border.strong};">

              <p style="margin:0 0 2px;color:${theme.text.muted};font-size:10px;font-weight:700;
                letter-spacing:1.2px;text-transform:uppercase;font-family:${theme.font};">${escapeHtml(greetingLabel)}</p>
              <h2 class="em-h2" style="margin:0 0 24px;color:${theme.text.primary};font-size:20px;
                font-weight:700;line-height:1.3;font-family:${theme.font};">${escapeHtml(greetingName)}</h2>

              ${progressHtml}
              ${paragraphsHtml}
              ${infoCardsHtml}
              ${ctaHtml}
              ${secondaryNoteHtml}

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="em-footer" style="padding:20px 28px 28px;text-align:center;
              background:${theme.bg.surface};
              border:1px solid ${theme.border.strong};
              border-top:none;
              border-radius:0 0 16px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    <div style="height:1px;width:48px;background:${theme.border.normal};margin:0 auto;"></div>
                  </td>
                </tr>
                <tr>
                  <td align="center">${footerHtml}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /EMAIL CONTAINER -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}
