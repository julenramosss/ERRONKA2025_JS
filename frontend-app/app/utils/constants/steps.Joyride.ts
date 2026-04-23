import type { Step } from "react-joyride";

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD  (/dashboard)
// ─────────────────────────────────────────────────────────────────────────────
export const DASHBOARD_STEPS: Step[] = [
  {
    target: ".tour-dashboard-header",
    title: "👋 Ongi etorri, PakAG!",
    content:
      "Hemen aurkituko duzu gaurko data, zure izena eta gaur entregatzeko dituzu pakete kopurua.",
    disableBeacon: true,
  },
  {
    target: ".tour-start-route-btn",
    title: "🚀 Ibilbidea hasi",
    content:
      "Botoi honek «Nire ibilbidea» orrira eramaten zaitu gaurko entregak kudeatzeko.",
  },
  {
    target: ".tour-stat-cards",
    title: "📊 Estatistika txartelak",
    content:
      "Lau txartel hauek erakusten dute esleitutako, entregatutako, garraioan dauden eta huts egindako paketeak.",
  },
  {
    target: ".tour-next-deliveries",
    title: "📦 Hurrengo entregatuak",
    content:
      "Hemen ikusten dituzu lehentasunezko paketeak. Pakete batean klik eginez mapan kokatzen da.",
    placement: "top",
  },
  {
    target: ".tour-next-deliveries",
    title: "🖱️ Pakete batean klik bikoitza",
    content:
      "Pakete baten gainean klik bikoitza eginez zuzenean «Pakete xehetasuna» orrialdea irekiko da.",
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

// ─────────────────────────────────────────────────────────────────────────────
// MY PACKAGES  (/myPackages)
// ─────────────────────────────────────────────────────────────────────────────
export const MY_PACKAGES_STEPS: Step[] = [
  {
    target: ".tour-packages-header",
    title: "📋 Nire paketeak",
    content:
      "Orrialde honetan zure pakete guztiak kudeatu ditzakezu: bilatu, filtratu eta ikusi.",
    disableBeacon: true,
  },
  {
    target: ".tour-packages-search",
    title: "🔍 Bilaketa",
    content:
      "Idatzi destinatarioa edo tracking kodea pakete bat bilatzen hasteko.",
  },
  {
    target: ".tour-packages-filters",
    title: "🏷️ Iragazkiak",
    content:
      "Egoeraren arabera filtratu: Denak, Esleituta, Garraioan, Entregatuta, Huts egin...",
  },
  {
    target: ".tour-packages-view-toggle",
    title: "⊞ Ikuspegi aldaketa",
    content:
      "Zerrendaren edo saretaren artean alda dezakezu paketeak modu desberdinean ikusteko.",
  },
  {
    target: ".tour-packages-table",
    title: "📄 Pakete zerrenda",
    content:
      "Pakete bakoitzeko tracking kodea, hartzailea, helbidea, egoera eta entrega data ikusiko dituzu.",
  },
  {
    target: ".tour-packages-detail-link",
    title: "👁️ Ikusi gehiago",
    content:
      "«Ikusi gehiago» botoiari klik eginez pakete horren xehetasun guztiak ikusiko dituzu.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGE DETAIL  (/myPackages/:id)
// ─────────────────────────────────────────────────────────────────────────────
export const PACKAGE_DETAIL_STEPS: Step[] = [
  {
    target: ".tour-pkg-detail-header",
    title: "📦 Pakete xehetasuna",
    content:
      "Pakete honen tracking kodea, egoera nagusia eta azken eguneraketa data hemen aurkituko dituzu.",
    disableBeacon: true,
  },
  {
    target: ".tour-pkg-info-card",
    title: "📋 Pakete informazioa",
    content:
      "Hartzailearen izena, helbidea, pisua, dimentsioak eta estimatutako entrega data.",
  },
  {
    target: ".tour-pkg-status-history",
    title: "📜 Egoera historia",
    content:
      "Paketearen egoera-aldaketa guztien denbora-lerroa, data eta orduarekin.",
  },
  {
    target: ".tour-pkg-delivery-location",
    title: "📍 Entrega kokapena",
    content:
      "Helmugararen mapa-ikuspegia Here Maps bidez, helbidearen geolokalizazioarekin.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MY ROUTE  (/myRoute)
// ─────────────────────────────────────────────────────────────────────────────
export const MY_ROUTE_STEPS: Step[] = [
  {
    target: ".tour-route-header",
    title: "🗺️ Nire ibilbidea",
    content:
      "Hemen kudeatzen duzu gaurko edo hurrengo egunerako entrega-ibilbidea.",
    disableBeacon: true,
  },
  {
    target: ".tour-route-status-btn",
    title: "▶️ Ibilbidea abiarazi / bukatu",
    content:
      "Botoi honek ibilbidearen egoera aldatzen du: Planifikatua → Aktibo → Bukatua.",
  },
  {
    target: ".tour-route-progress",
    title: "📈 Aurrerapena",
    content:
      "Barra honek entregatutako geldialdien ehunekoa erakusten du, hurrengo aktibo den geldialdiarekin.",
  },
  {
    target: ".tour-route-stops-list",
    title: "📍 Geldialdiak",
    content:
      "Entrega-ordena bermatzen duten geldialdi guztiak. Aktibo dagoenean, hurrengo geldialdia nabarmentzen da.",
  },
  {
    target: ".tour-route-stop-actions",
    title: "✅ Geldialdiaren ekintzak",
    content:
      "Pakete bat «Entregatuta» edo «Huts» marka dezakezu botoi hauekin. Ordena errespetatu behar da.",
  },
  {
    target: ".tour-route-google-maps",
    title: "🧭 Google Maps",
    content:
      "Botoi honek Google Maps irekitzen du geldialdi guztien bidea erabiltzeko GPS gidatzaile gisa.",
  },
  {
    target: ".tour-route-map-panel",
    title: "🗺️ Ibilbide mapa",
    content:
      "Mapa honetan geldialdi hautatuaren kokapena ikusten da Here Maps bidez.",
    placement: "left",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY  (/history)
// ─────────────────────────────────────────────────────────────────────────────
export const HISTORY_STEPS: Step[] = [
  {
    target: ".tour-history-header",
    title: "📜 Historiala",
    content:
      "Amaitutako pakete guztiak ikus ditzakezu hemen, iragazkiak eta bilaketak erabiliz.",
    disableBeacon: true,
  },
  {
    target: ".tour-history-period",
    title: "📅 Epea",
    content: "Azaltzen den epean amaitutako paketeak erakusten ditu.",
  },
  {
    target: ".tour-history-search",
    title: "🔍 Bilaketa",
    content: "Hartzaile edo tracking kodearen arabera bilatu dezakezu.",
  },
  {
    target: ".tour-history-filters",
    title: "🏷️ Iragazkiak",
    content:
      "Egoeraren arabera filtratu: Denak, Entregatuta, Huts egin edo Entregatu gabe.",
  },
  {
    target: ".tour-history-stats",
    title: "📊 Estatistikak",
    content:
      "Pakete guztiren laburpena: totala, entregatuta, huts egindakoak eta entrega-tasa.",
  },
  {
    target: ".tour-history-chart",
    title: "📉 Grafikoa",
    content:
      "Barra-diagrama honek denboran zehar amaitutako paketeak bisualizatzen ditu.",
  },
  {
    target: ".tour-history-list",
    title: "📋 Pakete zerrenda",
    content:
      "Eguneko taldeetan ordenatutako pakete guztiak, egoera-ikurrekin eta helbideekin.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS  (/settings)
// ─────────────────────────────────────────────────────────────────────────────
export const SETTINGS_STEPS: Step[] = [
  {
    target: ".tour-settings-aside",
    title: "⚙️ Ezarpenak",
    content:
      "Hiru atal dituzu: Profila, Segurtasuna eta Itxura. Egin klik bakoitzean.",
    disableBeacon: true,
  },
  {
    target: ".tour-settings-general",
    title: "👤 Profila",
    content:
      "Zure izen osoa, e-posta, erabiltzaile IDa eta kontuaren sorrera data ikusi ditzakezu.",
  },
  {
    target: ".tour-settings-security",
    title: "🔒 Segurtasuna",
    content:
      "Hemen aldatu dezakezu zure pasahitza. Unekoa eta pasahitz berria behar dituzu.",
  },
  {
    target: ".tour-settings-appearance",
    title: "🎨 Itxura",
    content:
      "Animazioak aktibatu/desaktibatu, data formatua aukeratu eta tutorialaren erakusketa kontrolatu.",
  },
  {
    target: ".tour-settings-tutorial-toggle",
    title: "💡 Tutoriala berriz ikusi",
    content:
      "Toggle hau aktibatuz hurrengo saioan tutoriala automatikoki erakutsiko zaizu.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL NAV  (present in every page via layout)
// ─────────────────────────────────────────────────────────────────────────────
export const NAV_STEPS: Step[] = [
  {
    target: ".tour-sidebar",
    title: "🧭 Nabigazio-barra",
    content:
      "Barra honetatik aplikazioko orrialde guztietara sartu zaitezke: Dashboard, Paketeak, Ibilbidea, Historiala eta Ezarpenak.",
    disableBeacon: true,
  },
  {
    target: ".tour-header-search",
    title: "🔍 Pakete bilaketa",
    content:
      "Goiburuko bilaketarekin pakete bat tracking kodearen bidez bila dezakezu. Lasterbidea: Ctrl / ⌘ + K.",
  },
  {
    target: ".tour-header-avatar",
    title: "🙋 Zure profila",
    content: "Inicialak erakusten dituzte zure izen eta abizenekin.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ALL STEPS combined (useful for a single full-app walkthrough)
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_TUTORIAL_STEPS: Step[] = [
  ...NAV_STEPS,
  ...DASHBOARD_STEPS,
  ...MY_PACKAGES_STEPS,
  ...PACKAGE_DETAIL_STEPS,
  ...MY_ROUTE_STEPS,
  ...HISTORY_STEPS,
  ...SETTINGS_STEPS,
];
