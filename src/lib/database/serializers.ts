import { readJsonObject, readStringArray } from './mysql-json';

type Metrics = Record<string, unknown>;

export function normalizeProjectCollections<
  T extends {
    gallery?: unknown;
    screenshots?: unknown;
    tags?: unknown;
    team?: unknown;
    metrics?: unknown;
  },
>(project: T) {
  return {
    ...project,
    gallery: readStringArray(project.gallery),
    screenshots: readStringArray(project.screenshots),
    tags: readStringArray(project.tags),
    team: readStringArray(project.team),
    metrics: readJsonObject<Metrics>(project.metrics),
  };
}

export function normalizeServiceCollections<
  T extends {
    features?: unknown;
    deliverables?: unknown;
    requirements?: unknown;
    gallery?: unknown;
    tags?: unknown;
  },
>(service: T) {
  return {
    ...service,
    features: readStringArray(service.features),
    deliverables: readStringArray(service.deliverables),
    requirements: readStringArray(service.requirements),
    gallery: readStringArray(service.gallery),
    tags: readStringArray(service.tags),
  };
}

export function normalizeBugReportCollections<
  T extends {
    methodology?: unknown;
    tools?: unknown;
    affectedAssets?: unknown;
    screenshots?: unknown;
    proofOfConcept?: unknown;
    collaborators?: unknown;
  },
>(report: T) {
  return {
    ...report,
    methodology: readStringArray(report.methodology),
    tools: readStringArray(report.tools),
    affectedAssets: readStringArray(report.affectedAssets),
    screenshots: readStringArray(report.screenshots),
    proofOfConcept: readStringArray(report.proofOfConcept),
    collaborators: readStringArray(report.collaborators),
  };
}

export function normalizePlatformCollections<
  T extends {
    certificates?: unknown;
    badges?: unknown;
  },
>(platform: T) {
  return {
    ...platform,
    certificates: readStringArray(platform.certificates),
    badges: readStringArray(platform.badges),
  };
}

export function normalizeMethodologyCollections<
  T extends {
    steps?: unknown;
    tools?: unknown;
    prerequisites?: unknown;
    exampleTargets?: unknown;
    examplePayloads?: unknown;
    commonMistakes?: unknown;
    resources?: unknown;
    references?: unknown;
  },
>(methodology: T) {
  return {
    ...methodology,
    steps: readStringArray(methodology.steps),
    tools: readStringArray(methodology.tools),
    prerequisites: readStringArray(methodology.prerequisites),
    exampleTargets: readStringArray(methodology.exampleTargets),
    examplePayloads: readStringArray(methodology.examplePayloads),
    commonMistakes: readStringArray(methodology.commonMistakes),
    resources: readStringArray(methodology.resources),
    references: readStringArray(methodology.references),
  };
}

export function normalizeServicePackageCollections<
  T extends {
    services?: unknown;
    features?: unknown;
    limitations?: unknown;
  },
>(servicePackage: T) {
  return {
    ...servicePackage,
    services: readStringArray(servicePackage.services),
    features: readStringArray(servicePackage.features),
    limitations: readStringArray(servicePackage.limitations),
  };
}
