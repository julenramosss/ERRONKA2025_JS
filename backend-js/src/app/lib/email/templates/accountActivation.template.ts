import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { AccountActivationTemplateParams } from "./types";

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.delivered.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`;

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
    heroIconSvg: HERO_ICON,
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
