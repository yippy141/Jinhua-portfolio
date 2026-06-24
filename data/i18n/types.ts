import type { Project, ProjectDetail, ProjectSlug } from "@/data/projects";

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

export type LocalePageContent = {
  about: AboutContent;
  research: ResearchContent;
  archive: ArchiveContent;
  contact: ContactContent;
};

export type ProjectContentOverlay = {
  title: string;
  node?: string;
  dek?: string;
  description?: string;
  tags?: readonly string[];
  detail?: ProjectDetail;
  translationStatus: TranslationStatus;
  pendingNotice?: string;
};

export type LocaleContent = {
  site: SiteMetadataContent;
  pages: LocalePageContent;
  projects: Record<ProjectSlug, ProjectContentOverlay>;
};

export type LocalizedProject = Omit<
  Project,
  "title" | "node" | "dek" | "description" | "tags" | "detail"
> & {
  title: string;
  node: string;
  dek: string;
  description: string;
  tags: readonly string[];
  detail?: ProjectDetail;
  translationStatus: TranslationStatus;
  pendingNotice?: string;
  hasLocalizedEditorial: boolean;
};
