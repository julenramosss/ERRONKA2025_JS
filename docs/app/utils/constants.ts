import { DocsDictionary } from "../i18n/en";

export const navItems = (nav: DocsDictionary["navigation"]) => [
  { href: "/", label: nav.home },
  { href: "/project", label: nav.projectOverview },
  { href: "/monorepo", label: nav.monorepo },
  { href: "/setup", label: nav.setup },
  { href: "/environment", label: nav.environment },
  { href: "/backend", label: nav.backend },
  { href: "/frontend", label: nav.frontend },
  { href: "/architecture", label: nav.architecture },
  { href: "/api", label: nav.apiReference },
  { href: "/security", label: nav.authSecurity },
  { href: "/domain", label: nav.domainModel },
  { href: "/database", label: nav.database },
  { href: "/deployment", label: nav.deployment },
  { href: "/troubleshooting", label: nav.troubleshooting },
  { href: "/contributing", label: nav.contributing },
  { href: "/ai-workflow", label: nav.aiWorkflow },
  { href: "/audit", label: nav.docsAudit },
];
