import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PendingEmailTemplateParams } from "./types";

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
