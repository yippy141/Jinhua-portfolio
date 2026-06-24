import type { ProjectSlug } from "@/data/projects";
import type { PlaceId } from "@/data/places";

import type {
  LocaleContent,
  PlaceTextOverlay,
  ProjectContentOverlay,
} from "./types";

const projectContent = {
  "ir-worldview-inventory": {
    title: "国际关系理论倾向测评",
    node: "理论倾向测评",
    dek: "一份引导式测评，帮助你判断自己的观点更接近哪种国际关系理论流派，并用安全、科技和人工智能治理场景检验结果。",
    description:
      "这份测评通过一组假设性问题，帮助读者梳理自己更接近哪种国际关系理论流派。完成基础测评后，还可以用安全、科技和 AI 治理场景检验这一结果是否经得起推敲。",
    tags: ["国际关系理论", "人工智能治理"],
    detail: {
      whatYouCanExplore:
        "先完成测评，得到一份基于国际关系理论的评估结果，再用安全、科技和 AI 治理场景测试它。",
    },
    linkLabels: {
      "Open the inventory": "打开测评",
    },
    previewAlt:
      "国际关系理论倾向测评的预览图，展示测评界面和理论分类结果。",
    translationStatus: "complete",
  },
  "asia-ai-safety-atlas": {
    title: "亚洲人工智能安全图谱",
    node: "AI 安全图谱",
    dek: "一份可搜索的亚洲 AI 安全机构图谱，可按国家、机构类型和工作领域筛选，并查看每条记录的来源。",
    description:
      "这份图谱整理亚洲各地参与 AI 安全能力建设的机构。可按国家、机构类型和工作领域筛选，点开每个条目都能查看信息来源。",
    tags: ["算力", "人工智能治理"],
    detail: {
      whatYouCanExplore:
        "按国家、机构类型和工作领域筛选，查看每条记录背后的来源。",
    },
    linkLabels: {
      "Open the atlas": "打开图谱",
    },
    previewAlt: "亚洲人工智能安全图谱的预览图，展示一张地图界面。",
    translationStatus: "complete",
  },
  "china-semiconductor-atlas": {
    title: "中国半导体设备图谱",
    node: "半导体设备",
    dek: "一份中国半导体设备制造商图谱，标明各家公司服务的生产环节，以及仍依赖国外设备的领域。",
    description:
      "这张图谱聚焦中国半导体设备制造商，梳理各设备商对应的生产环节，以及目前仍依赖国外设备的领域。",
    tags: ["半导体", "出口管制"],
    detail: {
      whatYouCanExplore:
        "按设备制造商查看其服务的生产环节，并了解哪些环节仍离不开国外设备。",
    },
    linkLabels: {
      "Open the atlas": "打开图谱",
    },
    previewAlt: "中国半导体设备图谱的预览图。",
    translationStatus: "complete",
  },
  "celestial-dragon-atlas": {
    title: "天龙：中国商业航天图谱",
    node: "商业航天",
    dek: "一张中国商业航天公司、发射活动和星座布局地图，并标注它们与国家安全和工业政策的关联。",
    description:
      "这张图谱整理了中国商业航天公司、火箭发射记录、星座布局，以及它们与国家工业能力和安全优先事项之间的关联。",
    tags: ["商业航天", "算力"],
    detail: {
      whatYouCanExplore:
        "浏览商业航天公司、发射记录和星座布局，查看它们与国家安全和工业政策的关联。",
    },
    previewAlt: "中国商业航天图谱的预览图。",
    translationStatus: "complete",
  },
  "mine-to-magnet-capability-tracker": {
    title: "从矿山到磁体：稀土能力追踪",
    node: "稀土能力",
    dek: "一个追踪中国以外采矿、分离精炼、金属及磁体制造项目的工具，区分已经投产与仍处于宣布阶段的项目，并标出技能和工艺能力的关键瓶颈。",
    description:
      "这个追踪器覆盖中国以外从采矿到磁体制造的项目，明确区分哪些已经形成实际产能、哪些仍停留在宣布阶段，并标出技能和工艺能力的关键瓶颈。",
    tags: ["稀土", "供应链"],
    detail: {
      whatYouCanExplore:
        "查看哪些项目已经转化为实际产能，哪些还停留在宣布阶段，以及技能和工艺关键瓶颈在哪里。",
      evidenceAndLimits:
        "追踪器明确区分已投产项目和仅宣布的项目。仅宣布的项目不会被视为实际产能。",
    },
    linkLabels: {
      "Open the atlas": "打开追踪器",
    },
    previewAlt:
      "从矿山到磁体：稀土能力追踪的预览图，展示供应链项目追踪界面。",
    translationStatus: "complete",
  },
  "psii": {
    title: "私营部门影响力指数（PSII）",
    node: "私营部门影响力",
    dek: "一个比较私营部门如何影响外交政策和冲突风险的指数。当前版本以菲律宾为案例，并公开权重、来源和敏感性测试。",
    description:
      "PSII 是一个用于比较私营部门对外交政策和冲突风险影响程度的指数。当前版本以菲律宾为案例，公开权重、来源和敏感性测试。",
    tags: ["私营部门影响", "外交政策"],
    detail: {
      whatYouCanExplore:
        "查看指数背后的权重、来源和敏感性测试。当前版本以菲律宾为案例。",
      evidenceAndLimits:
        "指数公开权重和来源，敏感性测试显示排名对这些选择有多敏感。",
    },
    linkLabels: {
      "Explore the PSII dashboard": "查看指数",
    },
    previewAlt: "私营部门影响力指数（PSII）的预览图。",
    translationStatus: "complete",
  },
  "philippines-south-china-sea": {
    title: "私营部门如何影响非对称冲突",
    node: "私营部门与南海",
    dek: "一篇已发表的章节，讨论企业如何提高、降低或改变冲突风险，以菲律宾在南海的案例为研究对象。",
    description:
      "这是一篇正式出版的学术章节，讨论企业如何提高、降低或改变冲突风险的走向，并以菲律宾在南海争端中的处境为案例。该章节收录于 Springer Nature 2025 年出版的 Good Governance in East Asia and Latin America。",
    tags: ["海事", "外交政策"],
    detail: {
      myRole: "该章节的唯一作者，包括田野调研。",
    },
    linkLabels: {
      "Read the chapter (Springer)": "阅读章节（Springer）",
    },
    previewAlt: "私营部门如何影响非对称冲突的预览图。",
    translationStatus: "complete",
  },
  "personal-substack": {
    title: "写作",
    node: "写作",
    dek: "关于科技、权力和战略的文章和笔记。",
    description: "关于科技、权力和战略的文章和笔记。",
    tags: ["文章", "笔记"],
    linkLabels: {
      "Read on Substack": "在 Substack 上阅读",
    },
    previewAlt: "写作项目的预览图。",
    translationStatus: "complete",
  },
} satisfies Record<ProjectSlug, ProjectContentOverlay>;

const placeText = {
  "washington-dc": {
    name: "华盛顿特区",
    summary:
      "我在 SAIS 完成硕士学业，并在多个政治风险和科技政策岗位工作过。这里是我现在的常驻地。",
  },
  vancouver: {
    name: "温哥华",
    summary: "我出生在这里，后来回 UBC 学习国际关系。",
  },
  shanghai: {
    name: "上海",
    summary: "童年和少年时代的大部分时间在这里度过，也在这里高中毕业。",
  },
  "hong-kong": {
    name: "香港",
    summary: "亲戚在这里，也是在这里参与创建了早期科技公司 Sampan。",
  },
  ottawa: {
    name: "渥太华",
    summary:
      "2020 至 2021 年，我在加拿大环境与气候变化部和加拿大全球事务部工作，包括新冠疫情爆发后的第一年。",
  },
  beijing: {
    name: "北京",
    summary: "亲戚在这里，很多关于农历新年的记忆也属于这里。",
  },
  singapore: {
    name: "新加坡",
    summary: "亲戚在这里，也是我至今仍经常回去的城市。",
  },
  paris: {
    name: "巴黎",
    summary: "2018 年夏天在 Sciences Po 学习，也在这里见证法国队赢得世界杯。",
  },
  hangzhou: { name: "杭州" },
  nanjing: { name: "南京" },
  yangshuo: { name: "阳朔" },
  lijiang: { name: "云南丽江" },
  dali: { name: "云南大理" },
  macau: { name: "澳门" },
  shenzhen: { name: "深圳" },
  changchun: { name: "长春" },
  seoul: { name: "首尔" },
  tokyo: { name: "东京" },
  sapporo: { name: "札幌" },
  niseko: { name: "北海道新雪谷" },
  taipei: { name: "台北" },
  kaohsiung: { name: "高雄" },
  taichung: { name: "台中" },
  "kuala-lumpur": { name: "吉隆坡" },
  manila: { name: "马尼拉" },
  penang: { name: "槟城" },
  hanoi: { name: "河内" },
  "ho-chi-minh-city": { name: "胡志明市" },
  bangkok: { name: "曼谷" },
  phuket: { name: "普吉岛" },
  dubai: { name: "迪拜" },
  "st-petersburg": { name: "圣彼得堡" },
  helsinki: { name: "赫尔辛基" },
  stockholm: { name: "斯德哥尔摩" },
  tallinn: { name: "塔林" },
  gdansk: { name: "格但斯克" },
  copenhagen: { name: "哥本哈根" },
  rostock: { name: "罗斯托克" },
  berlin: { name: "柏林" },
  dresden: { name: "德累斯顿" },
  frankfurt: { name: "法兰克福" },
  prague: { name: "布拉格" },
  budapest: { name: "布达佩斯" },
  vienna: { name: "维也纳" },
  amsterdam: { name: "阿姆斯特丹" },
  brussels: { name: "布鲁塞尔" },
  normandy: { name: "法国诺曼底" },
  rome: { name: "罗马" },
  milan: { name: "米兰" },
  florence: { name: "佛罗伦萨" },
  london: { name: "伦敦" },
  manchester: { name: "曼彻斯特" },
  edinburgh: { name: "爱丁堡" },
  cambridge: { name: "剑桥" },
  barcelona: { name: "巴塞罗那" },
  malaga: { name: "马拉加" },
  marbella: { name: "马贝拉" },
  malta: { name: "马耳他" },
  "new-york-city": { name: "纽约" },
  boston: { name: "波士顿" },
  philadelphia: { name: "费城" },
  baltimore: { name: "巴尔的摩" },
  chicago: { name: "芝加哥" },
  toronto: { name: "多伦多" },
  montreal: { name: "蒙特利尔" },
  "san-francisco": { name: "旧金山" },
  "san-jose": { name: "圣何塞" },
  "los-angeles": { name: "洛杉矶" },
  "san-diego": { name: "圣迭戈" },
  seattle: { name: "西雅图" },
  havana: { name: "哈瓦那" },
} satisfies Record<PlaceId, PlaceTextOverlay>;

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
  methodology: {
    metadata: {
      title: "方法与局限",
      description:
        "这个网站上的项目遵循统一的证据标准。公开主张可追溯到来源，并标注证据类别、可信度和不确定性。",
    },
    title: "方法与局限",
    introduction:
      "这个网站上的项目遵循同一个证据标准。把标准写在这里，是为了让它在不同项目之间保持一致。",
    ruleTitle: "核心规则",
    rule:
      "每一条公开事实陈述都可以追溯到一个来源条目。如果项目中出现一个数字或陈述，背后一定有一个条目写明资料来源、出版日期、最后查阅日期、证据类别、可信度和定位信息。不会保留无法追溯来源的事实陈述。",
    sourceRecordTitle: "来源条目包含哪些信息",
    sourceRecordFields: [
      {
        term: "来源",
        gloss: "该主张所依据的出版物或文件，并附带可访问的链接。",
      },
      {
        term: "出版日期 / 最后查阅日期",
        gloss: "来源的出版日期，以及我最后查阅该来源的日期。",
      },
      {
        term: "证据类别",
        gloss: "信息来源的种类，按证据强度分级。",
      },
      {
        term: "证据可信度",
        gloss: "该主张应被赋予多少权重，用清晰的语言说明。",
      },
      {
        term: "定位信息",
        gloss: "数据在来源中的具体位置，如页码、表格行次或时间戳，便于读者核验。",
      },
      {
        term: "不确定性说明",
        gloss: "如果有任何不清楚或无法确认的地方，在此说明。",
      },
    ],
    evidenceClassesTitle: "证据类别，从最强到最弱",
    evidenceClasses: [
      {
        term: "官方及一手文件",
        gloss: "一手材料，如政府报告、订单簿、企业申报文件等。",
      },
      {
        term: "新闻稿",
        gloss: "公司或政府发布的新闻稿或公告。",
      },
      {
        term: "监管申报",
        gloss: "向投资者或监管机构提交的申报文件。",
      },
      {
        term: "监管机构",
        gloss: "监管机构或标准制定组织发布的数据。",
      },
      {
        term: "媒体背景",
        gloss: "权威媒体报道，用作背景参考，而不是主要证据。",
      },
      {
        term: "第三方数据集",
        gloss: "外部数据集，在许可范围内使用。",
      },
      {
        term: "人工估算",
        gloss: "由本人自行估算，并明确标注为估算值。",
      },
      {
        term: "占位符",
        gloss: "仅用于占位，不会作为真实数据呈现。",
      },
    ],
    confidenceTitle: "证据可信度",
    confidenceLevels: [
      {
        term: "高",
        gloss: "多个有说服力的一手来源相互印证。",
        className: "text-confidence-high",
      },
      {
        term: "中",
        gloss: "整体趋势较为清楚，但来源较少，或部分依据二手资料。",
        className: "text-confidence-medium",
      },
      {
        term: "低",
        gloss: "仅有单一、可信度较低的来源，或结论主要依赖推断。",
        className: "text-confidence-low",
      },
    ],
    claimStatusTitle: "主张状态",
    claimStatuses: [
      {
        term: "已确认",
        gloss: "已有一手来源证实。",
      },
      {
        term: "已报道",
        gloss: "已有媒体报道或公告，但尚未在一手资料中确认。",
      },
      {
        term: "计划或预测",
        gloss: "面向未来的计划、目标或预测。",
      },
      {
        term: "占位符",
        gloss: "作为占位使用，有明显标注和样式，不会与真实信息混淆。",
      },
    ],
    limitsTitle: "局限",
    limits:
      "这些项目基于公开资料编制，不是实时数据，也不包含非公开信息。若公开资料存在缺口，项目会如实指出，而不是自行填补。项目中查不到某项信息，说明公开资料不足，不代表该事物不存在。",
    buildTitle: "这些项目如何制作",
    build:
      "这些项目在代码编写和数据整理过程中使用了人工智能辅助。来源选择与分析判断由本人完成。",
    correctionsTitle: "更正方式",
    corrections: {
      beforeLink: "如果你发现错误，可以",
      linkLabel: "联系我",
      afterLink: "。项目更新时会注明更正内容。",
    },
  },
  projects: projectContent,
  places: placeText,
} satisfies LocaleContent;
