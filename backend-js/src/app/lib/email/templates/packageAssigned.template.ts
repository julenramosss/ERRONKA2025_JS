import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { AssignedEmailTemplateParams } from "./types";

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
