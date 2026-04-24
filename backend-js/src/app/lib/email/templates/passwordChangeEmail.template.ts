import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PasswordChangeEmailTemplateParams } from "./types";

const HERO_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${theme.status.pending.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/><path d="m4 22 1.5-1.5"/></svg>`;

export const passwordChangeEmailTemplate = (
  params: PasswordChangeEmailTemplateParams
): string => {
  const { recipientName, changePasswordUrl } = params;

  return renderEmailLayout({
    title: "Berrezarri zure pasahitza - PakAG",
    preheader:
      "Zure pasahitza aldatzeko eskaera jaso dugu eta esteka segurua sortu dugu.",
    statusBadge: {
      label: "Segurtasuna",
      fg: theme.status.pending.fg,
      bg: theme.status.pending.bg,
    },
    heroIconSvg: HERO_ICON,
    greetingName: recipientName,
    headline: "Berrezarri zure PakAG pasahitza",
    paragraphs: [
      "Pasahitza berritzeko eskaera jaso dugu. Beheko botoia erabiliz pasahitz berria ezarri dezakezu modu seguruan.",
      `Segurtasunagatik, esteka honek <strong style="color:${theme.text.primary};">15 minutu</strong> baino ez ditu indarrean egongo.`,
    ],
    cta: {
      label: "Berrezarri pasahitza",
      url: changePasswordUrl,
    },
    secondaryNote:
      "Eskaera hau zuk egin ez baduzu, mezu hau alde batera utz dezakezu. Zure pasahitza ez da aldatuko esteka erabili ezean.",
  });
};
