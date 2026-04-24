import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { AssignedEmailTemplateParams } from "./types";

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.assigned.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`;

export const packageAssignedTemplate = (
  params: AssignedEmailTemplateParams
): string => {
  const { recipientName, trackingUrl, estimatedDelivery } = params;

  return renderEmailLayout({
    title: "Zure paketea banatzaile bati esleitu diogu - PakAG",
    preheader:
      "Zure bidalketa banatzaile bati esleituta dago, eta hemen duzu berriro jarraipen esteka.",
    statusBadge: {
      label: "Esleitua",
      fg: theme.status.assigned.fg,
      bg: theme.status.assigned.bg,
    },
    heroIconSvg: HERO_ICON,
    progressSteps: [
      { label: "Erregistratua", status: "completed" },
      { label: "Esleitua", status: "current" },
      { label: "Bidean", status: "upcoming" },
      { label: "Entregatua", status: "upcoming" },
    ],
    greetingName: recipientName,
    headline: "Banatzailea dagoeneko esleituta dago",
    paragraphs: [
      "Zure paketea gure banaketa operazioan sartu da eta arduradun bat izendatu diogu. Une honetan entrega antolatzen ari gara.",
      "Jarraipen esteka hemen duzu berriro, nahi duzunean zure bidalketaren egoera kontsultatzeko eta hurrengo mugimenduak ikusteko.",
    ],
    infoCards: estimatedDelivery
      ? [
          {
            label: "Aurreikusitako entrega",
            value: estimatedDelivery,
            accent: theme.status.assigned.fg,
          },
        ]
      : undefined,
    cta: {
      label: "Ikusi jarraipena",
      url: trackingUrl,
    },
    secondaryNote:
      "Momentuz ez duzu ezer egin behar. Zure paketea benetan bidean jartzen dugunean beste abisu bat jasoko duzu.",
  });
};
