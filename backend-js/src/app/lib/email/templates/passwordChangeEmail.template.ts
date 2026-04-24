import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { PasswordChangeEmailTemplateParams } from "./types";

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
