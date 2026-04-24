import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";

export interface AssignedEmailTemplateParams {
  recipientName: string;
  estimatedDelivery?: string;
}

export const packageAssignedTemplate = (
  params: AssignedEmailTemplateParams
): string => {
  const { recipientName, estimatedDelivery } = params;

  return renderEmailLayout({
    title: "Zure paketea banatzaile bati esleitu diogu - PakAG",
    preheader:
      "Zure bidalketa banatzaile bati esleituta dago eta entregarako prestatzen ari gara.",
    statusBadge: {
      label: "Esleitua",
      fg: theme.status.assigned.fg,
      bg: theme.status.assigned.bg,
    },
    greetingName: recipientName,
    headline: "Banatzailea dagoeneko esleituta dago",
    paragraphs: [
      "Zure paketea gure banaketa operazioan sartu da eta arduradun bat izendatu diogu. Une honetan entrega antolatzen ari gara.",
      "Jarraipen esteka lehenengo jakinarazpenean bidali dizugu. Hemendik aurrera ez dugu esteka bera mezu guztietan errepikatuko, baina indarrean jarraitzen du.",
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
    secondaryNote:
      "Momentuz ez duzu ezer egin behar. Zure paketea benetan bidean jartzen dugunean beste abisu bat jasoko duzu.",
  });
};
