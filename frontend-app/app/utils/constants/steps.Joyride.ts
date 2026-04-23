import type { Step } from "react-joyride";

// Nav steps shown on every page, at the beginning of a per-page tour.
export const NAV_STEPS: Step[] = [
  {
    target: ".tour-sidebar",
    title: "🧭 Nabigazio-barra",
    content:
      "Barra honetatik aplikazioko orrialde guztietara sartu zaitezke: Dashboard, Paketeak, Ibilbidea, Historiala eta Ezarpenak.",
    placement: "right",
  },
  {
    target: ".tour-sidebar-toggle",
    title: "↔️ Barra txikitu",
    content:
      "Botoi honekin alboko barra txikitu edo zabaldu dezakezu espazio gehiago izateko.",
    placement: "right",
  },
  {
    target: ".tour-sidebar-user",
    title: "👤 Saioa eta profila",
    content:
      "Zure izena, rola eta saioa ixteko botoia. Inizialak erakusten dira abatarrean.",
    placement: "right",
  },
  {
    target: ".tour-header-breadcrumb",
    title: "📍 Uneko orrialdea",
    content: "Goiburuko migak erakusten dute zein orrialdean zauden une oro.",
    placement: "bottom",
  },
  {
    target: ".tour-header-search",
    title: "🔍 Pakete bilaketa azkarra",
    content:
      "Goiburuko bilaketarekin pakete bat tracking kodearen bidez bila dezakezu. Lasterbidea: Ctrl / ⌘ + K.",
    placement: "bottom",
  },
];

// Dashboard  (/dashboard)
export const DASHBOARD_STEPS: Step[] = [
  {
    target: ".tour-dashboard-header",
    title: "👋 Ongi etorri, pakAG!",
    content:
      "Hemen aurkituko duzu gaurko data, zure izena eta gaur entregatzeko dituzun pakete kopurua.",
    placement: "bottom",
  },
  {
    target: ".tour-start-route-btn",
    title: "🚀 Ibilbidea hasi",
    content:
      "Botoi honek «Nire ibilbidea» orrira eramaten zaitu gaurko entregak kudeatzeko.",
    placement: "bottom",
  },
  {
    target: ".tour-stat-cards",
    title: "📊 Estatistika txartelak",
    content:
      "Lau txartel hauek erakusten dute esleitutako, entregatutako, garraioan dauden eta huts egindako paketeak.",
    placement: "bottom",
  },
  {
    target: ".tour-next-deliveries",
    title: "📦 Hurrengo entregatuak",
    content:
      "Hemen ikusten dituzu lehentasunezko paketeak. Pakete batean klik eginez mapan kokatzen da.",
    placement: "top",
  },
  {
    target: ".tour-recent-activity",
    title: "🕐 Azken jarduera",
    content:
      "Azken egoera-aldaketak kronologikoki erakusten ditu, kolore-puntuekin bereizita.",
    placement: "top",
  },
  {
    target: ".tour-dashboard-map",
    title: "🗺️ Mapa",
    content:
      "Pakete bat hautatzen duzunean, hemen ikusten da helmugarako kokapena Here Maps bidez.",
    placement: "top",
  },
];

// My Packages  (/myPackages)
export const MY_PACKAGES_STEPS: Step[] = [
  {
    target: ".tour-packages-header",
    title: "📋 Nire paketeak",
    content:
      "Orrialde honetan zure pakete guztiak kudeatu ditzakezu: bilatu, filtratu eta ikusi.",
    placement: "bottom",
  },
  {
    target: ".tour-packages-view-toggle",
    title: "⊞ Ikuspegi aldaketa",
    content:
      "Zerrendaren edo saretaren artean alda dezakezu paketeak modu desberdinean ikusteko.",
    placement: "left",
  },
  {
    target: ".tour-packages-search",
    title: "🔍 Bilaketa",
    content:
      "Idatzi destinatarioa edo tracking kodea pakete bat bilatzen hasteko.",
    placement: "bottom",
  },
  {
    target: ".tour-packages-filters",
    title: "🏷️ Iragazkiak",
    content:
      "Egoeraren arabera filtratu: Denak, Esleituta, Garraioan, Entregatuta, Huts egin...",
    placement: "bottom",
  },
  {
    target: ".tour-packages-table",
    title: "📄 Pakete zerrenda",
    content:
      "Pakete bakoitzeko tracking kodea, hartzailea, helbidea, egoera eta entrega data ikusiko dituzu.",
    placement: "top",
  },
];

// Package Detail  (/myPackages/:id)
export const PACKAGE_DETAIL_STEPS: Step[] = [
  {
    target: ".tour-pkg-detail-header",
    title: "📦 Pakete xehetasuna",
    content:
      "Pakete honen tracking kodea eta itzultzeko estekak hemen aurkituko dituzu.",
    placement: "bottom",
  },
  {
    target: ".tour-pkg-info-card",
    title: "📋 Pakete informazioa",
    content:
      "Hartzailearen izena, helbidea, pisua eta estimatutako entrega data.",
    placement: "right",
  },
  {
    target: ".tour-pkg-status-history",
    title: "📜 Egoera historia",
    content:
      "Paketearen egoera-aldaketa guztien denbora-lerroa, data eta orduarekin.",
    placement: "top",
  },
  {
    target: ".tour-pkg-delivery-location",
    title: "📍 Entrega kokapena",
    content:
      "Helmugarako mapa-ikuspegia Here Maps bidez eta kanpoko nabigaziorako esteka.",
    placement: "left",
  },
];

// My Route  (/myRoute)
export const MY_ROUTE_STEPS: Step[] = [
  {
    target: ".tour-route-header",
    title: "🗺️ Nire ibilbidea",
    content:
      "Hemen kudeatzen duzu gaurko edo hurrengo egunerako entrega-ibilbidea.",
    placement: "bottom",
  },
  {
    target: ".tour-route-status-btn",
    title: "▶️ Ibilbidea abiarazi / bukatu",
    content:
      "Botoi honek ibilbidearen egoera aldatzen du: Planifikatua → Aktibo → Bukatua.",
    placement: "left",
  },
  {
    target: ".tour-route-progress",
    title: "📈 Aurrerapena",
    content:
      "Barra honek entregatutako geldialdien ehunekoa erakusten du, hurrengo aktibo den geldialdiarekin.",
    placement: "bottom",
  },
  {
    target: ".tour-route-stops-list",
    title: "📍 Geldialdiak",
    content:
      "Entrega-ordena bermatzen duten geldialdi guztiak. Aktibo dagoenean, hurrengo geldialdia nabarmentzen da.",
    placement: "right",
  },
  {
    target: ".tour-route-google-maps",
    title: "🧭 Google Maps",
    content:
      "Botoi honek Google Maps irekitzen du geldialdi guztien bidea erabiltzeko GPS gidari gisa.",
    placement: "bottom",
  },
  {
    target: ".tour-route-map-panel",
    title: "🗺️ Ibilbide mapa",
    content:
      "Mapa honetan geldialdi hautatuaren kokapena ikusten da Here Maps bidez.",
    placement: "left",
  },
];

// History  (/history)
export const HISTORY_STEPS: Step[] = [
  {
    target: ".tour-history-header",
    title: "📜 Historiala",
    content:
      "Amaitutako pakete guztiak ikus ditzakezu hemen, iragazkiak eta bilaketak erabiliz.",
    placement: "bottom",
  },
  {
    target: ".tour-history-period",
    title: "📅 Epea",
    content: "Azaltzen den epean amaitutako paketeak erakusten ditu.",
    placement: "left",
  },
  {
    target: ".tour-history-search",
    title: "🔍 Bilaketa",
    content: "Hartzaile edo tracking kodearen arabera bilatu dezakezu.",
    placement: "bottom",
  },
  {
    target: ".tour-history-filters",
    title: "🏷️ Iragazkiak",
    content:
      "Egoeraren arabera filtratu: Denak, Entregatuta, Huts egin edo Entregatu gabe.",
    placement: "bottom",
  },
  {
    target: ".tour-history-stats",
    title: "📊 Estatistikak",
    content:
      "Pakete guztien laburpena: totala, entregatuta, huts egindakoak eta entrega-tasa.",
    placement: "bottom",
  },
  {
    target: ".tour-history-chart",
    title: "📉 Grafikoa",
    content:
      "Barra-diagrama honek denboran zehar amaitutako paketeak bisualizatzen ditu.",
    placement: "top",
  },
  {
    target: ".tour-history-list",
    title: "📋 Pakete zerrenda",
    content:
      "Eguneko taldeetan ordenatutako pakete guztiak, egoera-ikurrekin eta helbideekin.",
    placement: "top",
  },
];

// Settings  (/settings)
export const SETTINGS_STEPS: Step[] = [
  {
    target: ".tour-settings-aside",
    title: "⚙️ Ezarpenak",
    content:
      "Hiru atal nagusi dituzu: Profila, Segurtasuna eta Itxura. Egin klik bakoitzean.",
    placement: "right",
  },
  {
    target: ".tour-settings-content",
    title: "📋 Atal aktiboa",
    content:
      "Hemen ikusiko duzu hautatutako atalaren edukia. Hasieran, profil informazioa.",
    placement: "top",
  },
  {
    target: ".tour-settings-tutorial-toggle",
    title: "💡 Tutoriala berriz ikusi",
    content:
      "«Itxura» atalean toggle hau aktibatuz tutoriala berriro erakutsiko zaizu orrialdeak bisitatzean.",
    placement: "left",
  },
];

// All steps combined (kept for backwards compat or full walkthrough use cases).
export const ALL_TUTORIAL_STEPS: Step[] = [
  ...NAV_STEPS,
  ...DASHBOARD_STEPS,
  ...MY_PACKAGES_STEPS,
  ...PACKAGE_DETAIL_STEPS,
  ...MY_ROUTE_STEPS,
  ...HISTORY_STEPS,
  ...SETTINGS_STEPS,
];

// Pure path → steps resolution. Nav steps are prepended so they always play
// once at the start of whichever page the user first sees the tour on.
export function getStepsForPath(pathname: string, includeNav: boolean): Step[] {
  const pageSteps = resolvePageSteps(pathname);
  if (pageSteps.length === 0) return [];
  return includeNav ? [...NAV_STEPS, ...pageSteps] : pageSteps;
}

function resolvePageSteps(pathname: string): Step[] {
  if (pathname.startsWith("/dashboard")) return DASHBOARD_STEPS;
  if (/^\/myPackages\/[^/]+/.test(pathname)) return PACKAGE_DETAIL_STEPS;
  if (pathname.startsWith("/myPackages")) return MY_PACKAGES_STEPS;
  if (pathname.startsWith("/myRoute")) return MY_ROUTE_STEPS;
  if (pathname.startsWith("/history")) return HISTORY_STEPS;
  if (pathname.startsWith("/settings")) return SETTINGS_STEPS;
  return [];
}
