import { renderEmailLayout } from "./_layout.template";
import { theme } from "./_theme";

export interface LoginNotificationTemplateParams {
  recipientName: string;
  loginAt: string;
  ipAddress: string;
  userAgent: string;
}

function summarizeUserAgent(userAgent: string): string {
  if (!userAgent || userAgent === "unknown" || userAgent === "Ezezaguna") {
    return "Gailu ezezaguna";
  }

  const ua = userAgent.toLowerCase();
  let browser = "Nabigatzaile ezezaguna";
  if (ua.includes("edg/")) browser = "Microsoft Edge";
  else if (ua.includes("chrome/") && !ua.includes("edg/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/") && !ua.includes("chrome/")) browser = "Safari";
  else if (ua.includes("opera") || ua.includes("opr/")) browser = "Opera";

  let os = "";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os x") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) {
    os = "iOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  }

  return os ? `${browser} - ${os}` : browser;
}

export const loginNotificationTemplate = (
  params: LoginNotificationTemplateParams
): string => {
  const { recipientName, loginAt, ipAddress, userAgent } = params;

  return renderEmailLayout({
    title: "Saio berria zure kontuan - PakAG",
    preheader: "Zure kontuan saio berria hasi dela jakinarazten dizugu.",
    statusBadge: {
      label: "Saio berria",
      fg: theme.status.login.fg,
      bg: theme.status.login.bg,
    },
    greetingName: recipientName,
    headline: "Saio berria detektatu dugu zure kontuan",
    paragraphs: [
      "Segurtasun neurri gisa, zure PakAG kontuan saioa hasten den bakoitzean mezu informatibo hau bidaltzen dizugu.",
      "Saio hau zuk hasi baduzu, ez duzu ezer egin behar. Ezaguna ez bazaizu, aldatu pasahitza ahalik eta lasterren eta berrikusi zure segurtasun ezarpenak.",
    ],
    infoCards: [
      {
        label: "Data eta ordua",
        value: loginAt,
        accent: theme.status.login.fg,
      },
      {
        label: "IP helbidea",
        value: ipAddress,
        accent: theme.accent.light,
      },
      {
        label: "Gailua",
        value: summarizeUserAgent(userAgent),
        accent: theme.accent.light,
      },
    ],
    secondaryNote:
      "Mezu hau informazio hutsa da. Saioa ezaguna ez bazaizu, sartu aplikazioan eta eguneratu berehala zure sarbide datuak.",
  });
};
