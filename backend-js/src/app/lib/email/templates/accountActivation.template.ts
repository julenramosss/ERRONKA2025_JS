import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { AccountActivationTemplateParams } from "./types";

export const accountActivationTemplate = (
  params: AccountActivationTemplateParams
): string => {
  const { recipientName, activationUrl } = params;

  return renderEmailLayout({
    title: "Aktibatu zure PakAG kontua",
    preheader:
      "Zure kontua prest dago. Lehenengo sarbidea amaitzeko aktibazioa falta da.",
    statusBadge: {
      label: "Ongi etorri",
      fg: theme.status.delivered.fg,
      bg: theme.status.delivered.bg,
    },
    greetingName: recipientName,
    headline: "Aktibatu zure PakAG kontua",
    paragraphs: [
      "Zure erabiltzailea sortu dugu eta orain lehenengo sarbidea amaitu behar duzu. Horretarako, aktibazio esteka segurua bidali dizugu.",
      `Esteka honek <strong style="color:${theme.text.primary};">7 egun</strong> iraungo du. Ondoren, berriro sortu beharko da.`,
    ],
    cta: {
      label: "Aktibatu kontua",
      url: activationUrl,
    },
    secondaryNote:
      "Mezu hau espero ez bazenuen, jarri harremanetan zure administratzailearekin edo ez erabili esteka.",
  });
};
