export interface DocsDictionary {
  metadata: {
    siteTitle: string;
    siteDescription: string;
  };
  brand: {
    productName: string;
    docsLabel: string;
    tagline: string;
  };
  navigation: {
    home: string;
    projectOverview: string;
    monorepo: string;
    setup: string;
    environment: string;
    backend: string;
    frontend: string;
    architecture: string;
    apiReference: string;
    authSecurity: string;
    domainModel: string;
    database: string;
    deployment: string;
    troubleshooting: string;
    contributing: string;
    aiWorkflow: string;
    docsAudit: string;
  };
  callouts: {
    note: string;
    warning: string;
    todo: string;
    needsVerification: string;
  };
  common: {
    onThisPage: string;
    lastUpdated: string;
    editThisPage: string;
    search: string;
  };
}

export const en: DocsDictionary = {
  metadata: {
    siteTitle: 'PakAG Engineering Docs',
    siteDescription:
      'Technical documentation for PakAG backend, frontend, operations, and onboarding.',
  },
  brand: {
    productName: 'PakAG',
    docsLabel: 'Engineering Docs',
    tagline: 'Delivery orchestration and tracking platform',
  },
  navigation: {
    home: 'Home',
    projectOverview: 'Project Overview',
    monorepo: 'Monorepo Structure',
    setup: 'Local Setup',
    environment: 'Environment Variables',
    backend: 'Backend',
    frontend: 'Frontend',
    architecture: 'Architecture',
    apiReference: 'API Reference',
    authSecurity: 'Auth & Security',
    domainModel: 'Domain Model',
    database: 'Database',
    deployment: 'Deployment',
    troubleshooting: 'Troubleshooting',
    contributing: 'Contributing',
    aiWorkflow: 'AI Documentation Workflow',
    docsAudit: 'Docs Audit',
  },
  callouts: {
    note: 'Note',
    warning: 'Warning',
    todo: 'TODO',
    needsVerification: 'Needs verification',
  },
  common: {
    onThisPage: 'On this page',
    lastUpdated: 'Last updated',
    editThisPage: 'Edit this page',
    search: 'Search',
  },
};
