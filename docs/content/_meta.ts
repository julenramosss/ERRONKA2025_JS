import { getDictionary } from "../app/i18n";

const dict = getDictionary("en");

export default {
  index: { title: dict.navigation.home, type: "page" },
  project: { title: dict.navigation.projectOverview },
  monorepo: { title: dict.navigation.monorepo },
  setup: { title: dict.navigation.setup },
  environment: { title: dict.navigation.environment },
  backend: { title: dict.navigation.backend },
  frontend: { title: dict.navigation.frontend },
  architecture: { title: "Architecture" },
  api: { title: dict.navigation.apiReference },
  security: { title: dict.navigation.authSecurity },
  domain: { title: dict.navigation.domainModel },
  database: { title: "Database" },
  deployment: { title: dict.navigation.deployment },
  troubleshooting: { title: dict.navigation.troubleshooting },
  contributing: { title: dict.navigation.contributing },
  "ai-workflow": { title: dict.navigation.aiWorkflow },
};
