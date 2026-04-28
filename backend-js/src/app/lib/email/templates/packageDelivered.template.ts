import { renderEmailLayout } from './_layout.template';
import { theme } from './_theme';
import type { DeliveredEmailTemplateParams } from './types';

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.delivered.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`;

export function packageDeliveredTemplate(
  params: DeliveredEmailTemplateParams
): string {
  const { recipientName, deliveredAt, trackingUrl } = params;

  return renderEmailLayout({
    title: 'Zure paketea entregatu dugu - PakAG',
    preheader: 'Entrega ondo amaitu da eta zure bidalketa itxita geratu da.',
    statusBadge: {
      label: 'Entregatua',
      fg: theme.status.delivered.fg,
      bg: theme.status.delivered.bg,
    },
    heroIconSvg: HERO_ICON,
    progressSteps: [
      { label: 'Erregistratua', status: 'completed' },
      { label: 'Esleitua', status: 'completed' },
      { label: 'Bidean', status: 'completed' },
      { label: 'Entregatua', status: 'completed' },
    ],
    greetingName: recipientName,
    headline: 'Zure paketea entregatu da',
    paragraphs: [
      'Paketea behar bezala entregatu dugu eta bidalketa arrakastaz amaitu da.',
      'Eskerrik asko PakAG erabiltzeagatik. Arazoren bat sumatzen baduzu, gure arreta taldearekin harremanetan jartzea gomendatzen dizugu lehenbailehen.',
    ],
    infoCards: [
      {
        label: 'Entregaren unea',
        value: deliveredAt,
        accent: theme.status.delivered.fg,
      },
    ],
    ...(trackingUrl
      ? { cta: { label: 'Ikusi jarraipena', url: trackingUrl } }
      : {}),
    secondaryNote:
      'Mezu hau zure erreferentziarako da. Entregaren inguruan zalantzarik baduzu, gorde abisu hau.',
  });
}
