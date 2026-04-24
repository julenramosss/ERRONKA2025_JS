import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";

export interface DeliveredEmailTemplateParams {
  recipientName: string;
  deliveredAt: string;
}

export function packageDeliveredTemplate(
  params: DeliveredEmailTemplateParams
): string {
  const { recipientName, deliveredAt } = params;

  return renderEmailLayout({
    title: "Zure paketea entregatu dugu - PakAG",
    preheader: "Entrega ondo amaitu da eta zure bidalketa itxita geratu da.",
    statusBadge: {
      label: "Entregatua",
      fg: theme.status.delivered.fg,
      bg: theme.status.delivered.bg,
    },
    greetingName: recipientName,
    headline: "Zure paketea entregatu da",
    paragraphs: [
      "Paketea behar bezala entregatu dugu eta bidalketa arrakastaz amaitu da.",
      "Eskerrik asko PakAG erabiltzeagatik. Arazoren bat sumatzen baduzu, gure arreta taldearekin harremanetan jartzea gomendatzen dizugu lehenbailehen.",
    ],
    infoCards: [
      {
        label: "Entregaren unea",
        value: deliveredAt,
        accent: theme.status.delivered.fg,
      },
    ],
    secondaryNote:
      "Mezu hau zure erreferentziarako da. Entregaren inguruan zalantzarik baduzu, gorde abisu hau.",
  });
}
