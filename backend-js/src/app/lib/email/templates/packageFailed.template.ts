import { renderEmailLayout } from './_layout.template';
import { theme } from './_theme';
import type { PackageFailedEmailTemplateParams } from './types';

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.failed.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

export function packageFailedEmailTemplate(
  params: PackageFailedEmailTemplateParams
): string {
  const { recipientName, failedAt, reason, trackingUrl } = params;

  const infoCards = [
    {
      label: 'Azken egoera aldaketa',
      value: failedAt,
      accent: theme.status.failed.fg,
    },
  ];

  if (reason) {
    infoCards.push({
      label: 'Arrazoia',
      value: reason,
      accent: theme.status.failed.fg,
    });
  }

  return renderEmailLayout({
    title: 'Ezin izan dugu zure paketea entregatu - PakAG',
    preheader:
      'Entrega ezin izan da osatu eta gure taldeak egoera berrikusten ari da.',
    statusBadge: {
      label: 'Arazoa',
      fg: theme.status.failed.fg,
      bg: theme.status.failed.bg,
    },
    heroIconSvg: HERO_ICON,
    progressSteps: [
      { label: 'Erregistratua', status: 'completed' },
      { label: 'Esleitua', status: 'completed' },
      { label: 'Bidean', status: 'completed' },
      { label: 'Entregatua', status: 'error' },
    ],
    greetingName: recipientName,
    headline: 'Entrega ezin izan da osatu',
    paragraphs: [
      'Saiakera egin dugu, baina bidalketa ezin izan da behar bezala amaitu. Horregatik, paketea entrega arazo batekin markatu dugu.',
      'Beharrezkoa bada, gure taldeak zurekin harremanetan jarriko da hurrengo pausoa adosteko.',
    ],
    infoCards,
    ...(trackingUrl
      ? { cta: { label: 'Ikusi jarraipena', url: trackingUrl } }
      : {}),
    secondaryNote:
      'Egoeraren inguruko informazio osagarria behar baduzu, jarri gurekin harremanetan zure eskaeraren datuak eskuan dituzula.',
  });
}
