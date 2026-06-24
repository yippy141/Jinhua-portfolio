# Chinese Copy V0

This file records the approved Simplified Chinese copy for V0. It does not
invent project titles, project descriptions, methodology prose, or source copy.

## Approved Identity And Routing Copy

| Surface | Approved copy or value |
| --- | --- |
| Chinese name | `叶锦华` |
| English name | `Jinhua Yip` |
| Public Chinese prefix | `/zh` |
| Internal locale | `zh-Hans` |
| English URLs | unprefixed |
| Chinese site title | `叶锦华｜研究与项目` |

## Surface Copy

| Surface | Approved copy |
| --- | --- |
| Name | `叶锦华` |
| Blurb | `我的一些项目。` |
| Dive in | `下潜` |
| Skip intro | `跳过开场` |

## Depths Copy

| Surface | Approved copy |
| --- | --- |
| Heading | `欢迎来到我的意识之海` |
| Blurb | `这里是我做过和正在做的一些项目。` |
| Browse all projects | `查看全部项目` |
| Return to surface | `返回海面` |

## Navigation Copy

| English source | Approved Chinese copy |
| --- | --- |
| About | `关于` |
| Research | `研究` |
| Archive / projects | `项目` |
| Contact | `联系` |
| Resume | `简历` |
| English switch label on Chinese pages | `EN` |
| Chinese switch label on English pages | `中文` |

## SEO Copy

| Field | Approved copy |
| --- | --- |
| Title | `叶锦华｜研究与项目` |
| Description | `叶锦华的个人网站，记录他围绕人工智能、半导体、关键矿产、国际关系与科技政策所做的研究、工具和写作。` |

## About Copy

Heading:

```txt
我研究技术如何改变权力。
```

Body:

```txt
我是叶锦华（Jinhua Yip），做科技政策研究。我的工作主要围绕人工智能、半导体、关键矿产和商业航天，也关注私营部门如何影响外交政策。

这个网站放着我把这些研究做成的工具、图谱、指数、问卷和文章。每个项目都会说明资料来源、方法和目前仍不确定的地方，方便读者自己判断。

我先后在英属哥伦比亚大学（UBC）和约翰斯·霍普金斯大学高级国际研究学院（SAIS）学习国际关系，也曾在加拿大政府和政治风险咨询机构工作。工作之外，我喜欢鲸、航空、地理和历史。这个网站之所以在海里，大概也和这些兴趣有关。
```

Methodology-link sentence:

```txt
想了解这些项目如何得出结论，以及哪些地方仍不确定，可以查看方法与局限。
```

## Research Copy

| Surface | Approved copy |
| --- | --- |
| Page label | `研究` |
| Heading | `研究、工具与写作` |
| Introduction | `这里放着我做的互动工具、研究框架和文章，主题包括国际关系、人工智能治理、政治经济和战略影响。` |
| Section label | `互动工具` |
| Section label | `文章与出版物` |

## Archive Copy

| Surface | Approved copy |
| --- | --- |
| Page label | `项目` |
| Heading | `全部项目` |
| Introduction | `这里是我正在做和已经完成的项目。` |

Archive UI labels:

| English source | Approved Chinese copy |
| --- | --- |
| All | `全部` |
| Flagship | `重点` |
| Lab | `实验` |
| Research | `研究` |
| Writing | `写作` |
| Open | `查看` |
| project / projects | `个项目` |

Project type and status labels used in the archive:

| English source | Approved Chinese copy |
| --- | --- |
| Tool | `工具` |
| Research | `研究` |
| Publication | `出版物` |
| Writing | `写作` |
| Beta | `测试版` |
| In progress | `进行中` |
| Published | `已发表` |

Short archive tag labels:

| English source | Approved Chinese copy |
| --- | --- |
| IR theory | `国际关系理论` |
| AI governance | `人工智能治理` |
| semiconductors | `半导体` |
| export controls | `出口管制` |
| commercial space | `商业航天` |
| compute | `算力` |
| rare earths | `稀土` |
| supply chains | `供应链` |
| private-sector influence | `私营部门影响` |
| foreign policy | `外交政策` |
| maritime | `海事` |
| essays | `文章` |
| notes | `笔记` |

## Contact Copy

| Surface | Approved copy |
| --- | --- |
| Heading | `联系我` |
| Introduction | `如果你想聊科技政策、数据可视化，或者有合作想法，欢迎来信。` |

Keep these platform names unchanged:

- `Email`
- `LinkedIn`
- `GitHub`
- `Substack`

## Approved Routing Decisions

- Chinese pages use the public `/zh` prefix.
- English remains unprefixed.
- The internal locale id is `zh-Hans`, even though the public prefix is `/zh`.
- Long editorial prose belongs in locale-specific typed content files.
- Short UI strings may use messages JSON.

## Project Title Status

No individual Chinese project titles are approved in V0. Keep the English title
for each project until a later approved copy file says otherwise.

Phase 1 temporary project-page notice:

```txt
中文介绍正在整理中。
```

| Slug | Current English title | Chinese title status |
| --- | --- | --- |
| `ir-worldview-inventory` | `IR Worldview Inventory` | Not approved. Keep English title for now. |
| `asia-ai-safety-atlas` | `Asia AI Safety Atlas` | Not approved. Keep English title for now. |
| `china-semiconductor-atlas` | `China Semiconductor Atlas` | Not approved. Keep English title for now. |
| `celestial-dragon-atlas` | `Celestial Dragon Atlas` | Not approved. Keep English title for now. |
| `mine-to-magnet-capability-tracker` | `Allied Rare Earths Atlas` | Not approved. Keep English title for now. |
| `psii` | `PSII Dashboard` | Not approved. Keep English title for now. |
| `philippines-south-china-sea` | `Private Sector Influence in Asymmetric Conflict` | Not approved. Keep English title for now. |
| `personal-substack` | `Writing` | Not approved. Keep English title for now. |

## Copy Not Supplied In V0

- Full Chinese Methodology page prose.
- Chinese project descriptions, deks, detail sections, link labels, tags, and
  alt text, except the short archive tag labels recorded above.
- Chinese project titles.
- Project-specific methodology, source, confidence, and claim-status copy.

Do not fill these gaps with generic descriptions. Do not invent Chinese project
titles or project descriptions yet.

## Content Storage Rule

Phase 1 should split content by type:

- Locale-specific typed content files: long prose, project deks, project
  descriptions, project detail sections, page introductions, metadata
  descriptions, alt text, and link labels whose meaning depends on the project.
- Messages JSON: short reusable UI strings, including navigation labels,
  buttons, filters, status labels, type labels, section headings, skip links,
  language switch labels, and compact control text.

The Chinese edition should not use one generic description across all projects.
