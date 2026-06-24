import { projects, type Project, type ProjectSlug } from "@/data/projects";

import type { LocaleContent, ProjectContentOverlay } from "./types";

const projectList: readonly Project[] = projects;

const projectContent = Object.fromEntries(
  projectList.map((project) => [
    project.slug,
    {
      title: project.title,
      node: project.node,
      dek: project.dek,
      description: project.description,
      tags: project.tags,
      detail: project.detail,
      translationStatus: "complete",
    } satisfies ProjectContentOverlay,
  ]),
) as unknown as Record<ProjectSlug, ProjectContentOverlay>;

export const enContent = {
  site: {
    title: "Jinhua Yip",
    description:
      "Research, essays, and editorial projects on international relations, technology, and political economy.",
  },
  pages: {
    about: {
      metadata: {
        title: "About",
        description:
          "Jinhua Yip is a technology-policy researcher working on AI, semiconductors, critical minerals, commercial space, and the role private companies play in foreign policy.",
      },
      heading: "I research how technology changes power.",
      body: [
        "I'm Jinhua Yip, a technology-policy researcher. My work covers artificial intelligence, semiconductors, critical minerals, commercial space, and the role private companies play in foreign policy.",
        "This site is where I turn that research into things people can use: maps, trackers, indices, questionnaires, and explainers. Each project includes its sources, method, and known gaps so readers can inspect the reasoning rather than take the result on trust.",
        "I studied international relations at SAIS and UBC and have worked in political-risk consulting and the Canadian government. Outside work, I follow whales, aviation, geography, and history. Those interests are the reason the portfolio takes place in an ocean rather than a conventional project grid.",
      ],
      methodologySentence:
        "Every project links to its methodology and limits, so you can see how a result was reached and where it is uncertain.",
      methodologyLinkLabel: "methodology and limits",
    },
    research: {
      metadata: {
        title: "Research",
        description: "Research projects and policy work by Jinhua Yip.",
      },
      label: "Research",
      heading: "Research systems, publications, and public analysis.",
      introduction:
        "A working shelf for interactive tools, research frameworks, and writing on international relations, AI governance, political economy, and strategic influence.",
      groups: [
        {
          title: "Interactive Systems",
          slugs: [
            "ir-worldview-inventory",
            "psii",
            "mine-to-magnet-capability-tracker",
          ],
        },
        {
          title: "Writing & Publications",
          slugs: ["personal-substack"],
        },
      ],
    },
    archive: {
      metadata: {
        title: "Archive",
        description:
          "An index of Jinhua Yip's research, tools, and writing on technology and power.",
      },
      label: "All projects",
      heading: "Maps, tools, and writing on technology and power.",
      introduction:
        "A working index of projects, publications, and research systems on international relations, AI governance, and political economy. Built to be useful to a newcomer and a specialist alike.",
    },
    contact: {
      metadata: {
        title: "Contact",
        description: "Contact information for Jinhua Yip.",
      },
      heading: "Get in touch",
      introduction: "",
    },
  },
  projects: projectContent,
} satisfies LocaleContent;
