import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PackageUndeliveredEmailTemplateParams } from "./types";

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.undelivered.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

export function packageUndeliveredTemplate(
  params: PackageUndeliveredEmailTemplateParams
): string {
  const { recipientName, attemptedAt } = params;

  return renderEmailLayout({
    title: "Gaur ezin izan dugu zure paketea entregatu - PakAG",
    preheader:
      "Gaurko entrega saiakera ez da amaitu, baina zure paketea seguru dago.",
    statusBadge: {
      label: "Entregatu gabe",
      fg: theme.status.undelivered.fg,
      bg: theme.status.undelivered.bg,
    },
    heroIconSvg: HERO_ICON,
    progressSteps: [
      { label: "Erregistratua", status: "completed" },
      { label: "Esleitua", status: "completed" },
      { label: "Bidean", status: "completed" },
      { label: "Entregatua", status: "upcoming" },
    ],
    greetingName: recipientName,
    headline: "Gaurko entrega saiakera ez da osatu",
    paragraphs: [
      "Banatzailea emandako helbidera hurbildu da, baina gaur ezin izan dugu entrega amaitu.",
      "Ez kezkatu: zure paketea seguru dago eta hurrengo operazio erabilgarrian berriz saiatuko gara edo egoera berria jakinaraziko dizugu.",
    ],
    infoCards: [
      {
        label: "Saiakeraren unea",
        value: attemptedAt,
        accent: theme.status.undelivered.fg,
      },
    ],
    secondaryNote:
      "Momentuz ez duzu ezer egin behar. Baldintza berriren bat behar badugu, beste jakinarazpen batean azalduko dizugu.",
  });
}
