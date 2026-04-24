import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PendingEmailTemplateParams } from "./types";

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.pending.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;

export const packagePendingTemplate = (
  params: PendingEmailTemplateParams
): string => {
  const { recipientName, trackingUrl } = params;

  return renderEmailLayout({
    title: "Zure paketea erregistratu dugu - PakAG",
    preheader:
      "Zure paketea ondo erregistratu da eta jarraipen esteka pertsonala prest dago.",
    statusBadge: {
      label: "Erregistratua",
      fg: theme.status.pending.fg,
      bg: theme.status.pending.bg,
    },
    heroIconSvg: HERO_ICON,
    progressSteps: [
      { label: "Erregistratua", status: "current" },
      { label: "Esleitua", status: "upcoming" },
      { label: "Bidean", status: "upcoming" },
      { label: "Entregatua", status: "upcoming" },
    ],
    greetingName: recipientName,
    headline: "Zure paketea erregistratuta dago",
    paragraphs: [
      "Paketea gure sisteman sartuta dago jada, eta hemendik aurrera egoera eguneratuak jasoko dituzu bidalketak aurrera egin ahala.",
      "Beheko esteka da zure jarraipen esteka pertsonala. Gorde ezazu, baina lasai: beharrezkoa denean berriro ere bidaliko dizugu.",
    ],
    cta: {
      label: "Ikusi jarraipena",
      url: trackingUrl,
    },
    secondaryNote:
      "Esteka hau izango da zure paketea kontsultatzeko bide nagusia. Bertan ikusiko dituzu egoera aldaketak eta entrega aurrerapena.",
  });
};
