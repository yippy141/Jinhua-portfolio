import type {
  Project,
  ProjectDetail,
  ProjectLink,
  ProjectPreview,
  ProjectSlug,
} from "@/data/projects";
import type { PlaceId } from "@/data/places";

export type TranslationStatus = "complete" | "pending";

export type SiteMetadataContent = {
  title: string;
  description: string;
};

export type PageMetadataContent = {
  title: string;
  description: string;
};

export type AboutContent = {
  metadata: PageMetadataContent;
  heading: string;
  body: readonly string[];
  methodologySentence: string;
  methodologyLinkLabel: string;
};

export type ResearchGroupContent = {
  title: string;
  slugs: readonly ProjectSlug[];
};

export type ResearchContent = {
  metadata: PageMetadataContent;
  label: string;
  heading: string;
  introduction: string;
  groups: readonly ResearchGroupContent[];
};

export type ArchiveContent = {
  metadata: PageMetadataContent;
  label: string;
  heading: string;
  introduction: string;
};

export type ContactContent = {
  metadata: PageMetadataContent;
  heading: string;
  introduction: string;
};

export type MethodologyListItem = {
  term: string;
  gloss: string;
  className?: string;
};

export type MethodologyContent = {
  metadata: PageMetadataContent;
  title: string;
  introduction: string;
  ruleTitle: string;
  rule: string;
  sourceRecordTitle: string;
  sourceRecordFields: readonly MethodologyListItem[];
  evidenceClassesTitle: string;
  evidenceClasses: readonly MethodologyListItem[];
  confidenceTitle: string;
  confidenceLevels: readonly MethodologyListItem[];
  claimStatusTitle: string;
  claimStatuses: readonly MethodologyListItem[];
  limitsTitle: string;
  limits: string;
  buildTitle: string;
  build: string;
  correctionsTitle: string;
  corrections: {
    beforeLink: string;
    linkLabel: string;
    afterLink: string;
  };
};

export type LocalePageContent = {
  about: AboutContent;
  research: ResearchContent;
  archive: ArchiveContent;
  contact: ContactContent;
};

export type PlaceTextOverlay = {
  name: string;
  summary?: string;
};

export type ProjectContentOverlay = {
  title: string;
  node?: string;
  dek?: string;
  description?: string;
  tags?: readonly string[];
  detail?: ProjectDetail;
  linkLabels?: Readonly<Record<string, string>>;
  previewAlt?: string;
  translationStatus: TranslationStatus;
  pendingNotice?: string;
};

export type LocaleContent = {
  site: SiteMetadataContent;
  pages: LocalePageContent;
  methodology: MethodologyContent;
  projects: Record<ProjectSlug, ProjectContentOverlay>;
  places: Record<PlaceId, PlaceTextOverlay>;
};

export type LocalizedProject = Omit<
  Project,
  | "title"
  | "node"
  | "dek"
  | "description"
  | "tags"
  | "detail"
  | "links"
  | "preview"
> & {
  title: string;
  node: string;
  dek: string;
  description: string;
  tags: readonly string[];
  detail?: ProjectDetail;
  links: readonly ProjectLink[];
  preview: ProjectPreview;
  translationStatus: TranslationStatus;
  pendingNotice?: string;
  hasLocalizedEditorial: boolean;
};
