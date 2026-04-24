import { escapeHtml, renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";
import type { InTransitEmailTemplateParams } from "./types";

export function packageInTransitTemplate(
  params: InTransitEmailTemplateParams
): string {
  const { recipientName, distributorName, estimatedDelivery } = params;
  const safeDistributorName = escapeHtml(distributorName);

  return renderEmailLayout({
    title: "Zure paketea gaur bidean da - PakAG",
    preheader:
      "Zure paketea gaurko ibilbidean sartu dugu eta entregatzera goaz.",
    statusBadge: {
      label: "Bidean",
      fg: theme.status.inTransit.fg,
      bg: theme.status.inTransit.bg,
    },
    greetingName: recipientName,
    headline: "Zure paketea gaur entregatuko dugu",
    paragraphs: [
      `Zure paketea jada ibilbidean dago. <strong style="color:${theme.text.primary};">${safeDistributorName}</strong> banatzailea gaur bertan saiatuko da entrega osatzen.`,
      "Ahal baduzu, ziurtatu emandako helbidean norbait egongo dela paketea jasotzeko edo sarbidea erraza izango dela.",
    ],
    infoCards: [
      {
        label: "Aurreikusitako entrega",
        value: estimatedDelivery,
        accent: theme.status.inTransit.fg,
      },
      {
        label: "Banatzailea",
        value: distributorName,
        accent: theme.accent.light,
      },
    ],
    secondaryNote:
      "Jarraipen esteka aurreko mezuan bidalitakoa bera da. Gaurko informazio berriena han ikus dezakezu, esteka bera berriro bidali gabe.",
  });
}
