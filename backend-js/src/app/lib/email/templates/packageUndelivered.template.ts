import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PackageUndeliveredEmailTemplateParams } from "./types";

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
