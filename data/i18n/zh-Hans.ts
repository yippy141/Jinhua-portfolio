import type { ProjectSlug } from "@/data/projects";

import type { LocaleContent, ProjectContentOverlay } from "./types";

export const zhHansProjectPendingNotice = "中文介绍正在整理中。";

const pendingProject = (title: string): ProjectContentOverlay => ({
  title,
  translationStatus: "pending",
  pendingNotice: zhHansProjectPendingNotice,
});

const projectContent = {
  "ir-worldview-inventory": pendingProject("IR Worldview Inventory"),
  "asia-ai-safety-atlas": pendingProject("Asia AI Safety Atlas"),
  "china-semiconductor-atlas": pendingProject("China Semiconductor Atlas"),
  "celestial-dragon-atlas": pendingProject("Celestial Dragon Atlas"),
  "mine-to-magnet-capability-tracker": pendingProject("Allied Rare Earths Atlas"),
  "psii": pendingProject("PSII Dashboard"),
  "philippines-south-china-sea": pendingProject(
    "Private Sector Influence in Asymmetric Conflict",
  ),
  "personal-substack": pendingProject("Writing"),
} satisfies Record<ProjectSlug, ProjectContentOverlay>;

export const zhHansContent = {
  site: {
    title: "叶锦华｜研究与项目",
    description:
      "叶锦华的个人网站，记录他围绕人工智能、半导体、关键矿产、国际关系与科技政策所做的研究、工具和写作。",
  },
  pages: {
    about: {
      metadata: {
        title: "叶锦华｜研究与项目",
        description:
          "叶锦华的个人网站，记录他围绕人工智能、半导体、关键矿产、国际关系与科技政策所做的研究、工具和写作。",
      },
      heading: "我研究技术如何改变权力。",
      body: [
        "我是叶锦华（Jinhua Yip），做科技政策研究。我的工作主要围绕人工智能、半导体、关键矿产和商业航天，也关注私营部门如何影响外交政策。",
        "这个网站放着我把这些研究做成的工具、图谱、指数、问卷和文章。每个项目都会说明资料来源、方法和目前仍不确定的地方，方便读者自己判断。",
        "我先后在英属哥伦比亚大学（UBC）和约翰斯·霍普金斯大学高级国际研究学院（SAIS）学习国际关系，也曾在加拿大政府和政治风险咨询机构工作。工作之外，我喜欢鲸、航空、地理和历史。这个网站之所以在海里，大概也和这些兴趣有关。",
      ],
      methodologySentence:
        "想了解这些项目如何得出结论，以及哪些地方仍不确定，可以查看方法与局限。",
      methodologyLinkLabel: "方法与局限",
    },
    research: {
      metadata: {
        title: "叶锦华｜研究与项目",
        description:
          "叶锦华的个人网站，记录他围绕人工智能、半导体、关键矿产、国际关系与科技政策所做的研究、工具和写作。",
      },
      label: "研究",
      heading: "研究、工具与写作",
      introduction:
        "这里放着我做的互动工具、研究框架和文章，主题包括国际关系、人工智能治理、政治经济和战略影响。",
      groups: [
        {
          title: "互动工具",
          slugs: [
            "ir-worldview-inventory",
            "psii",
            "mine-to-magnet-capability-tracker",
          ],
        },
        {
          title: "文章与出版物",
          slugs: ["personal-substack"],
        },
      ],
    },
    archive: {
      metadata: {
        title: "全部项目",
        description: "这里是我正在做和已经完成的项目。",
      },
      label: "项目",
      heading: "全部项目",
      introduction: "这里是我正在做和已经完成的项目。",
    },
    contact: {
      metadata: {
        title: "叶锦华｜研究与项目",
        description:
          "叶锦华的个人网站，记录他围绕人工智能、半导体、关键矿产、国际关系与科技政策所做的研究、工具和写作。",
      },
      heading: "联系我",
      introduction:
        "如果你想聊科技政策、数据可视化，或者有合作想法，欢迎来信。",
    },
  },
  projects: projectContent,
} satisfies LocaleContent;
