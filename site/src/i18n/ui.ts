import type { Lang } from "../lib/paths";

/** The thirteen second-level headings the specification recommends, in order (spec/spec.md section 5.2). */
export const SECTIONS = [
  "Context",
  "Invariants",
  "Style",
  "File Structure",
  "Environment",
  "Knowledge",
  "Feedback",
  "Gates",
  "Authority",
  "Completion",
  "Entropy",
  "Open Questions",
  "References",
] as const;

const en = {
  siteDescription:
    "HARNESS.md is a single Markdown file that records the design of a project's agent harness. Find a ready-made entry in the hub, read the format specification, or install the plugin.",
  nav: { spec: "Specification", hub: "Hub", plugin: "Plugin" },
  navLabel: "Main",
  skip: "Skip to content",
  languageMenu: "Language",
  // Punctuation for generated lists ("label: value", "name (note)").
  colon: ": ",
  parens: (text: string) => ` (${text})`,
  actions: {
    copy: "Copy Markdown",
    copied: "Copied",
    more: "More page actions",
    menu: "Page actions",
    copyAs: "Copy as Markdown",
    viewAs: "View as Markdown",
    newTab: "opens in a new tab",
    download: "Download HARNESS.md",
    github: "View on GitHub",
    source: "View source on GitHub",
    copyFailed: "Copy failed. Open “View as Markdown” and copy the text from there.",
  },
  footer: { source: "Source on GitHub", license: "Apache-2.0 licence" },
  home: {
    title: "HARNESS.md",
    heading: "Find a HARNESS.md for your project",
    whatHeading: "What a HARNESS.md is",
    what: [
      "A <code>HARNESS.md</code> records the design of a project's agent harness: where a coding agent runs, what it reads, how it checks its own work, what stops a bad change, and what it may do without asking. The entrypoint file, the permission files, the hooks, and the CI configuration are built from it.",
      "You can use one in two ways. As a template: save a file from the hub in your project root, tell your coding agent what the project is for, and have it check the file's Context section against your project before it builds the harness. Delete the file afterwards if you like. Or as an anchor document: keep it in the repository as the project's lasting record of the design, change it rarely, and open it only to check the harness for drift or to improve it.",
      "The specification is there to help you write a <code>HARNESS.md</code>; reading one does not depend on it. An agent that has never seen the specification, with no plugin installed, can still read the file and act on it.",
    ],
    skeletonHeading: "What is in the file",
    skeletonLead:
      "A short frontmatter with the file's name and description, then a title, an introduction, and prose under whatever headings suit the design. The specification recommends these thirteen headings, in this order. None is required.",
    questions: [
      "the facts that shape the design: cost of a mistake, team, platform",
      "rules every task follows",
      "what the code should look like so agents can work in it",
      "the directories and files the design requires",
      "where the agent runs and what it can reach",
      "what the agent reads, and when",
      "how the agent verifies its own work",
      "the checks that stop defects",
      "what the agent may do on its own, and what needs a human",
      "how a goal is agreed, and what counts as done",
      "how the harness stays true to the code",
      "what is still undecided",
      "the material the design drew on",
    ],
    nextHeading: "Where to go next",
    next: [
      { path: "/spec/", label: "Read the specification", note: "The whole format, on one page." },
      { path: "/hub/", label: "Browse the hub", note: "Entries you can save into a project as its HARNESS.md." },
      {
        path: "/plugin/",
        label: "Install the plugin",
        note: "Skills that design, build, extract, and audit a harness in Claude Code, Codex, and Antigravity.",
      },
    ],
  },
  search: {
    label: "Search the hub",
    placeholder: "Search hub entries, e.g. prototype",
    hint: "Press Enter to open the first result.",
    count: (n: number) => (n === 1 ? "1 entry" : `${n} entries`),
    none: "No entries match. Try fewer words, or browse the whole hub.",
    empty: "The hub has no entries yet.",
    tagsLabel: "Filter by tag",
    allTags: "All",
    inText: "Found in the entry's text",
    browseAll: (n: number) => `Browse all ${n} entries in the hub`,
  },
  hub: {
    title: "Hub",
    lead: "Each entry is a complete HARNESS.md file, written so that a harness can be built from the file alone. Save one in your project root, tell your coding agent what the project is for, and have it check the Context section against your project before it builds.",
    contribute: "Entries are added by pull request to the {link}.",
    contributeLink: "hub directory on GitHub",
    back: "All hub entries",
    copyFailed: "Copy failed. Use “Download HARNESS.md” instead.",
    file: {
      copy: "Copy HARNESS.md",
      copyAs: "Copy HARNESS.md",
      viewAs: "View HARNESS.md",
      more: "More actions for HARNESS.md",
      menu: "HARNESS.md actions",
    },
    tags: "Tags",
    tagLink: "Hub entries tagged {tag}",
    license: "Licence",
    version: "Format version",
    basedOn: "Based on",
    sections: "Sections",
    entryLang: "The entry is written in English.",
  },
  prompt: {
    heading: "Use it with your agent",
    lead: "Paste this prompt into your coding agent. The agent reads the entry online, so there is nothing to download. Say what the project is for in the box below before you copy, or type it after you paste.",
    text: (url: string) =>
      `Read this file and use it as the design for this project's agent harness:\n${url}\n\nFollow its "How to use this file" section. Check its Context section against this project and tell me what does not fit, show me a plan of the files you will create or change, and build only after I approve the plan.\n\nAbout my project and what I need:`,
    ownLabel: "About your project and what you need",
    placeholder: "What the project is for, its language and tools, anything the agent should know",
    copy: "Copy prompt",
    copied: "Copied",
    copyFailed: "Copy failed. Select the prompt and copy it by hand.",
    manual:
      "To keep the file in the project instead, download it from the menu beside the button, save it as <code>HARNESS.md</code> in the project root, and tell your agent the same thing.",
  },
  spec: {
    title: "Specification",
    description:
      "The HARNESS.md format specification: what the format is for, the frontmatter, the recommended sections, and what a validator reports.",
    toc: "On this page",
  },
  plugin: {
    title: "Plugin",
    nav: "Plugin documentation",
  },
  notFound: {
    title: "Page not found",
    body: "There is nothing at this address.",
    home: "Go to the home page",
  },
};

type Strings = typeof en;

const zh: Strings = {
  siteDescription:
    "HARNESS.md 是一份 Markdown 文件，记录一个项目的 Agent harness 设计。在这里可以从 hub 里找一份现成的条目，阅读格式规范，或者安装插件。",
  nav: { spec: "规范", hub: "Hub", plugin: "插件" },
  navLabel: "主导航",
  skip: "跳到正文",
  languageMenu: "语言",
  colon: "：",
  parens: (text: string) => `（${text}）`,
  actions: {
    copy: "复制 Markdown",
    copied: "已复制",
    more: "更多页面操作",
    menu: "页面操作",
    copyAs: "复制为 Markdown",
    viewAs: "查看 Markdown 版本",
    newTab: "在新标签页打开",
    download: "下载 HARNESS.md",
    github: "在 GitHub 上查看",
    source: "在 GitHub 上查看源文件",
    copyFailed: "复制失败。请打开“查看 Markdown 版本”，从那里复制全文。",
  },
  footer: { source: "GitHub 源码", license: "Apache-2.0 许可证" },
  home: {
    title: "HARNESS.md",
    heading: "为你的项目找一份 HARNESS.md",
    whatHeading: "HARNESS.md 是什么",
    what: [
      "<code>HARNESS.md</code> 记录一个项目的 Agent harness 设计：编码 Agent 在哪里运行，读什么，怎样检查自己的工作，什么会拦住一次错误的改动，哪些事它可以不问就做。入口文件、权限文件、Hook 和 CI 配置都照着它来建。",
      "它有两种用法。当作模板：从 hub 里挑一份存到项目根目录，告诉编码 Agent 这个项目要做什么，让它先对照你的项目核对文件里的 Context 一节，再把 harness 建出来；建完可以把文件删掉。当作锚定文档：把它长期留在仓库里，作为项目的设计记录，很少改动，只在检查 harness 有没有漂移或者要改进它的时候才打开。",
      "写 <code>HARNESS.md</code> 时可以对照规范，读懂它不靠规范。Agent 即使从没见过规范，也没装任何插件，照样能读懂这份文件并照着做。",
    ],
    skeletonHeading: "文件里有什么",
    skeletonLead:
      "开头是一段简短的 frontmatter，写明文件的名称和说明；后面是标题、一段导言和正文，正文用哪些标题由设计决定。规范推荐下面十三个标题和这个顺序，没有一个是必选的。",
    questions: [
      "影响设计的项目条件：出错的代价、团队、平台",
      "每个任务都要遵守的规则",
      "代码应该是什么样，Agent 才能在里面工作",
      "设计要求的目录和文件",
      "Agent 在哪里运行，能碰到什么",
      "Agent 读什么，什么时候读",
      "Agent 怎样验证自己的工作",
      "拦住缺陷的检查",
      "哪些事 Agent 可以自己做，哪些需要人",
      "怎样对齐目标，怎样算做完",
      "harness 怎样与代码保持一致",
      "还没有决定的事",
      "这份设计依据的资料",
    ],
    nextHeading: "接下来看什么",
    next: [
      { path: "/spec/", label: "阅读规范", note: "完整的格式定义，一页读完。" },
      { path: "/hub/", label: "浏览 hub", note: "可以直接存进项目、当作 HARNESS.md 用的条目。" },
      {
        path: "/plugin/",
        label: "安装插件",
        note: "一组 skill，在 Claude Code、Codex 和 Antigravity 里设计、构建、提取和审计 harness。",
      },
    ],
  },
  search: {
    label: "搜索 hub",
    placeholder: "用英文搜索 hub 条目，例如 prototype",
    hint: "按回车打开第一条结果。",
    count: (n: number) => `${n} 个条目`,
    none: "没有匹配的条目。条目是用英文写的，换成英文关键词或者少用几个词试试。",
    empty: "hub 里还没有条目。",
    tagsLabel: "按标签筛选",
    allTags: "全部",
    inText: "在条目正文中找到",
    browseAll: (n: number) => `浏览 hub 里的全部 ${n} 个条目`,
  },
  hub: {
    title: "Hub",
    lead: "每个条目都是一份完整的 HARNESS.md 文件，写到单凭文件本身就能把 harness 建出来。挑一份存到项目根目录，告诉编码 Agent 这个项目要做什么，让它先对照你的项目核对 Context 一节，再动手建。",
    contribute: "新条目通过 pull request 提交到{link}。",
    contributeLink: "GitHub 上的 hub 目录",
    back: "全部 hub 条目",
    copyFailed: "复制失败，请改用“下载 HARNESS.md”。",
    file: {
      copy: "复制 HARNESS.md",
      copyAs: "复制 HARNESS.md",
      viewAs: "查看 HARNESS.md",
      more: "HARNESS.md 的更多操作",
      menu: "HARNESS.md 操作",
    },
    tags: "标签",
    tagLink: "带有 {tag} 标签的 hub 条目",
    license: "许可证",
    version: "格式版本",
    basedOn: "基于",
    sections: "章节",
    entryLang: "条目正文为英文。",
  },
  prompt: {
    heading: "交给你的 Agent",
    lead: "把这段提示词贴给你的编码 Agent。Agent 会在线读取这个条目，不用下载任何东西。项目是做什么的，可以先写在下面的输入框里再复制，也可以粘贴之后接着写。",
    text: (url: string) =>
      `请阅读下面这份文件，把它作为这个项目的 Agent harness 设计：\n${url}\n\n按文件里“How to use this file”一节的步骤做：先对照这个项目核对文件的 Context 一节，告诉我哪些地方对不上；再给我一份计划，列出你要新建或改动的文件；等我同意之后再动手。\n\n我的项目和需求：`,
    ownLabel: "你的项目和需求",
    placeholder: "项目做什么，用什么语言和工具，还有什么需要 Agent 知道的",
    copy: "复制提示词",
    copied: "已复制",
    copyFailed: "复制失败，请手动选中提示词复制。",
    manual:
      "想把文件留在项目里的话，用按钮旁边的菜单下载，存为项目根目录下的 <code>HARNESS.md</code>，再把同样的话告诉 Agent。",
  },
  spec: {
    title: "规范",
    description: "HARNESS.md 格式规范：格式的定位、frontmatter、推荐章节，以及校验器报告什么。",
    toc: "本页目录",
  },
  plugin: {
    title: "插件",
    nav: "插件文档",
  },
  notFound: {
    title: "找不到页面",
    body: "这个地址下没有内容。",
    home: "回到首页",
  },
};

const strings: Record<Lang, Strings> = { en, zh };

export function ui(lang: Lang): Strings {
  return strings[lang];
}
