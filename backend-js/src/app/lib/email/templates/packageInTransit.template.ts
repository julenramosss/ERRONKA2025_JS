import { escapeHtml, renderEmailLayout } from './_layout.template';
import { theme } from './_theme';
import type { InTransitEmailTemplateParams } from './types';

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.inTransit.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="7" height="7" x="14" y="11" rx="1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`;

export function packageInTransitTemplate(
  params: InTransitEmailTemplateParams
): string {
  const { recipientName, distributorName, estimatedDelivery, trackingUrl } =
    params;
  const safeDistributorName = escapeHtml(distributorName);

  return renderEmailLayout({
    title: 'Zure paketea gaur bidean da - PakAG',
    preheader:
      'Zure paketea gaurko ibilbidean sartu dugu eta entregatzera goaz.',
    statusBadge: {
      label: 'Bidean',
      fg: theme.status.inTransit.fg,
      bg: theme.status.inTransit.bg,
    },
    heroIconSvg: HERO_ICON,
    progressSteps: [
      { label: 'Erregistratua', status: 'completed' },
      { label: 'Esleitua', status: 'completed' },
      { label: 'Bidean', status: 'current' },
      { label: 'Entregatua', status: 'upcoming' },
    ],
    greetingName: recipientName,
    headline: 'Zure paketea gaur entregatuko dugu',
    paragraphs: [
      `Zure paketea jada ibilbidean dago. <strong style="color:${theme.text.primary};">${safeDistributorName}</strong> banatzailea gaur bertan saiatuko da entrega osatzen.`,
      'Ahal baduzu, ziurtatu emandako helbidean norbait egongo dela paketea jasotzeko edo sarbidea erraza izango dela.',
    ],
    infoCards: [
      {
        label: 'Aurreikusitako entrega',
        value: estimatedDelivery,
        accent: theme.status.inTransit.fg,
      },
      {
        label: 'Banatzailea',
        value: distributorName,
        accent: theme.accent.light,
      },
    ],
    ...(trackingUrl
      ? {
          cta: {
            label: 'Ikusi jarraipena',
            url: trackingUrl,
          },
        }
      : {}),
    secondaryNote: trackingUrl
      ? undefined
      : 'Jarraipen esteka aurreko mezuan bidalitakoa bera da. Gaurko informazio berriena han ikus dezakezu, esteka bera berriro bidali gabe.',
  });
}
