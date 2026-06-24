"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import { Icon } from "@/components/icons";
import type { LocalizedProject } from "@/data/i18n";

import { ProjectPreviewMedia } from "./project-preview-media";

// The hover/focus dossier: a compact anchored preview. Metadata is plain
// sentence case (no uppercase mono row), and the media is a real video where the
// project declares one.
type ProjectPreviewProps = {
  project: LocalizedProject;
  flagship: boolean;
  pos: { left: number; top: number };
  reducedMotion: boolean;
  showDescription: boolean;
};

export function ProjectPreview({
  project,
  flagship,
  pos,
  reducedMotion,
  showDescription,
}: ProjectPreviewProps) {
  const t = useTranslations("projects");

  return (
    <motion.aside
      role="dialog"
      aria-label={project.preview.alt}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: 300 }}
      className="pointer-events-none z-40 hidden border border-rule bg-paper-2 p-4 shadow-[0_24px_60px_rgba(4,9,8,0.55)] md:block"
    >
      <div className="flex items-center justify-between font-sans text-[12px] text-ink-2">
        <span>
          {t(`types.${project.type}`)} · {project.year}
        </span>
        <span className="text-sonar">{t(`statuses.${project.status}`)}</span>
      </div>

      <div className="mt-3">
        <ProjectPreviewMedia
          preview={project.preview}
          projectId={project.id}
          title={project.title}
          active
          reducedMotion={reducedMotion}
          flagship={flagship}
        />
      </div>

      <h2 className="mt-3 font-serif text-[18px] leading-tight text-ink">
        {project.title}
      </h2>
      {showDescription ? (
        <p className="mt-1.5 font-serif text-[13px] leading-snug text-ink-2">
          {project.dek}
        </p>
      ) : null}
      <div className="mt-3 flex items-center gap-1.5 border-t border-rule pt-3 text-oxblood">
        <span className="font-sans text-[13px]">{t("openProject")}</span>
        <Icon name="arrow" size={14} />
      </div>
    </motion.aside>
  );
}
