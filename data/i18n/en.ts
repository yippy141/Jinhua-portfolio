import { projects, type Project, type ProjectSlug } from "@/data/projects";
import { places, type Place, type PlaceId } from "@/data/places";

import type {
  LocaleContent,
  PlaceTextOverlay,
  ProjectContentOverlay,
} from "./types";

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

function placeName(place: Place): string {
  if (place.label) return place.label;
  return place.region ? `${place.city}, ${place.region}` : place.city;
}

const placeText = Object.fromEntries(
  places.map((place) => [
    place.id,
    {
      name: placeName(place),
      ...(place.kind === "life-anchor" ? { summary: place.summary } : {}),
    } satisfies PlaceTextOverlay,
  ]),
) as Record<PlaceId, PlaceTextOverlay>;

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
      heading: "greetings",
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
  methodology: {
    metadata: {
      title: "Methodology",
      description: "The evidence standard that governs every atlas on this site.",
    },
    title: "Methodology",
    introduction:
      "Every atlas on this site follows one evidence standard. This page states it once, so the standard does not vary from project to project.",
    ruleTitle: "The rule",
    rule:
      "Every public claim traces to a source record. If a number or a statement appears in an atlas, a record behind it names the source, when it was published, when it was retrieved, and how much weight it deserves. No orphan facts.",
    sourceRecordTitle: "What a source record contains",
    sourceRecordFields: [
      {
        term: "source",
        gloss: "The publication or document the claim comes from, with a link out.",
      },
      {
        term: "published / retrieved",
        gloss: "When the source was published and when it was last checked.",
      },
      {
        term: "evidence class",
        gloss: "What kind of source it is. The ladder is below.",
      },
      {
        term: "confidence",
        gloss: "How much weight the claim deserves, stated plainly.",
      },
      {
        term: "locator",
        gloss:
          "The page, table, row, or timestamp the claim came from, so a reader can check it.",
      },
      {
        term: "uncertainty note",
        gloss: "What is unclear, when something is.",
      },
    ],
    evidenceClassesTitle: "Evidence classes, strongest to weakest",
    evidenceClasses: [
      {
        term: "official",
        gloss: "Primary documents: official reports, order books, filings.",
      },
      {
        term: "press_release",
        gloss: "A company or government announcement.",
      },
      {
        term: "filing",
        gloss: "An investor or regulatory filing.",
      },
      {
        term: "regulator",
        gloss: "A regulator or standards body.",
      },
      {
        term: "media_context",
        gloss: "Reputable media, used for context rather than as primary proof.",
      },
      {
        term: "third_party_dataset",
        gloss: "An external dataset, used within its rights.",
      },
      {
        term: "manual_estimate",
        gloss: "My own estimate, always labeled as one.",
      },
      {
        term: "mock",
        gloss: "A placeholder. Never shown as real data.",
      },
    ],
    confidenceTitle: "Confidence, in plain words",
    confidenceLevels: [
      {
        term: "high",
        gloss: "Multiple strong primary sources agree.",
        className: "text-confidence-high",
      },
      {
        term: "medium",
        gloss: "The direction is clear, but sourcing is thin or partly secondary.",
        className: "text-confidence-medium",
      },
      {
        term: "low",
        gloss: "A single weak source, or an inference.",
        className: "text-confidence-low",
      },
    ],
    claimStatusTitle: "Claim status",
    claimStatuses: [
      {
        term: "confirmed",
        gloss: "Confirmed by a primary source.",
      },
      {
        term: "reported",
        gloss: "Announced or reported, not yet confirmed in primary records.",
      },
      {
        term: "projected",
        gloss: "Forward-looking: a plan, target, or forecast.",
      },
      {
        term: "mock",
        gloss:
          "A placeholder, visibly labeled and styled so it cannot be mistaken for real.",
      },
    ],
    limitsTitle: "Limits",
    limits:
      "These atlases work from the public record. They are not real-time, and they carry no privileged information. Where the record is thin, the atlas says so rather than filling the gap. An absence in an atlas means the public record is thin, not that the thing does not exist.",
    buildTitle: "How these are built",
    build:
      "These projects are built with AI assistance for code and data structuring. Source selection and analysis are my own judgment.",
    correctionsTitle: "Corrections",
    corrections: {
      beforeLink: "If you find an error, ",
      linkLabel: "tell me",
      afterLink: ". Corrections are noted when a project is updated.",
    },
  },
  projects: projectContent,
  places: placeText,
} satisfies LocaleContent;
