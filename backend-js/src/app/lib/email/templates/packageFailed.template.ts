import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PackageFailedEmailTemplateParams } from "./types";

export function packageFailedEmailTemplate(
  params: PackageFailedEmailTemplateParams
): string {
  const { recipientName, failedAt, reason } = params;

  const infoCards = [
    {
      label: "Azken egoera aldaketa",
      value: failedAt,
      accent: theme.status.failed.fg,
    },
  ];

  if (reason) {
    infoCards.push({
      label: "Arrazoia",
      value: reason,
      accent: theme.status.failed.fg,
    });
  }

  return renderEmailLayout({
    title: "Ezin izan dugu zure paketea entregatu - PakAG",
    preheader:
      "Entrega ezin izan da osatu eta gure taldeak egoera berrikusten ari da.",
    statusBadge: {
      label: "Arazoa",
      fg: theme.status.failed.fg,
      bg: theme.status.failed.bg,
    },
    greetingName: recipientName,
    headline: "Entrega ezin izan da osatu",
    paragraphs: [
      "Saiakera egin dugu, baina bidalketa ezin izan da behar bezala amaitu. Horregatik, paketea entrega arazo batekin markatu dugu.",
      "Beharrezkoa bada, gure taldeak zurekin harremanetan jarriko da hurrengo pausoa adosteko.",
    ],
    infoCards,
    secondaryNote:
      "Egoeraren inguruko informazio osagarria behar baduzu, jarri gurekin harremanetan zure eskaeraren datuak eskuan dituzula.",
  });
}
