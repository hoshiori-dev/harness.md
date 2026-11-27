# harness.md

[English](README.md) · [网站](https://hoshiori-dev.github.io/harness.md/zh/) ·
[规范](spec/spec.zh.md) · [Hub](hub/)

`HARNESS.md` 用一个文件记录项目为编码 Agent 做了哪些准备：
Agent 在哪里运行，读什么，怎样检查自己的工作，什么会拦住一次错误的改动，
哪些事它可以不问就做。这一整套准备，就是项目的 Agent harness。

它不是又一份给 Agent 的指令文件。
`AGENTS.md`、知识文件、权限配置、Hook 和 CI 检查，
是 Agent 每个任务都在用的东西。`HARNESS.md` 是它们背后的设计，
连同理由一起写下来。只有在搭建、检查或修改 harness 本身的时候，
Agent 才会打开它。

这个仓库里有四样东西：

- [格式规范](spec/spec.zh.md)；
- [hub](hub/)，一组拿来就能用的设计；
- `harness-md`，面向 Claude Code、Codex 和 Antigravity 的插件：
  让你和编码 Agent 一起为项目定出并搭好 harness，也能把设计写成文件；
- [网站](https://hoshiori-dev.github.io/harness.md/zh/)，可以在上面搜索 hub。

## 不装任何东西，先试一下

1. 在 [hub](hub/) 里挑一份设计，
   比如 [`solo-open-source-library`](hub/solo-open-source-library/SKILL.md)。
2. 把文件的地址交给你的编码 Agent，告诉它这个项目要做什么。
   文件不必放进你的仓库。
3. 让 Agent 把这份文件当作参考：
   先说出它的 Context 有哪些地方和你的项目对不上，
   动手写任何东西之前先给你一份计划。

计划里通常会有：一个 `AGENTS.md`，几份知识文件，
用来检查工作的命令，Hook 和 CI 任务，权限配置。
Agent 没装插件、不了解这个格式，也能读懂这份文件。

`HARNESS.md` 有四种用法：
把一个项目的全部或部分 harness 设计写下来交给别人；
从外部拿一份设计来做参考；
把想要模仿的项目的设计提炼出来，而不照搬它的实现；
以及，在项目自己决定的情况下，作为锚定文档留在根目录，
以后拿它核对 harness。
项目不需要有自己的 `HARNESS.md` 也能有一套好的 harness。

## 一分钟看懂格式

一份 `HARNESS.md` 由两部分组成。开头是 YAML frontmatter，
写明这份设计叫什么、适合什么项目（`name`、`description`，
以及可选的 `version`、`license`、`metadata`）。后面是自由书写的 Markdown 正文。
正文以标题和一段导言开头：harness 为谁服务，要达成什么，哪些事始终由人来做。
没有必选章节。格式推荐十三个英文标题和它们的顺序，
这样读者总能在同一个地方找到同一类内容：

| 章节 | 通常写什么 |
|---|---|
| Context | 设计必须适应的既定条件 |
| Invariants | 每个任务都要遵守的规则 |
| Style | 代码应该是什么样，Agent 才好在里面工作 |
| File Structure | 设计要求的目录布局 |
| Environment | Agent 在哪里运行，能访问什么 |
| Knowledge | Agent 读什么，什么时候读 |
| Feedback | Agent 怎样验证自己的工作 |
| Gates | 哪些检查拦住缺陷 |
| Authority | 哪些事 Agent 可以自己做，哪些需要人 |
| Completion | 怎样对齐目标，怎样算做完 |
| Entropy | harness 怎样与代码保持一致 |
| Open Questions | 还没决定的事 |
| References | 设计参考了什么 |

这个格式只有一个目标：写 `HARNESS.md` 时可以借助规范，读懂它不依赖规范。
正文全是普通的文字。Agent 很少加载这个文件，所以设计需要写多长，它就可以有多长。
[规范](spec/spec.zh.md)以[英文版](spec/spec.md)为准。

## 插件

### 安装

- **Claude Code**：
  `/plugin install harness-md --marketplace hoshiori-dev/harness.md`
  （Claude Code 2.1.275 及以上一步完成；
  更早的版本先执行 `/plugin marketplace add hoshiori-dev/harness.md` 再安装）。
  本地开发用 `claude --plugin-dir .`。
- **Codex**：先 `codex plugin marketplace add hoshiori-dev/harness.md`，
  再 `codex plugin add harness-md@harness-md`。
- **Antigravity**：
  `agy plugin install https://github.com/hoshiori-dev/harness.md`。

随 skill 分发的脚本是 Python，
运行它们需要先装好 [`uv`](https://docs.astral.sh/uv/)。

### 能用它做什么

| 你想 | 用 |
|---|---|
| 给项目搭一套 harness，不管是新项目还是有多年历史的项目 | `harness-create` |
| 搭的时候参考 hub 里或别的团队的一份设计 | `harness-create` 或 `harness-improve`，附上文件的地址或路径 |
| 查出现有配置哪里有问题，需要的话顺手修好 | `harness-improve` |
| 把自己项目的全部或部分设计写下来，用来分享或留存 | `harness-distill` |
| 想要一套和另一个项目类似的 harness | 先 `harness-adopt`，再 `harness-create` 或 `harness-improve` |

这四个 skill 是入口，只在你点名调用时运行：
在 Claude Code 里输入 `/harness-md:harness-create`，
在 Codex 里输入 `$harness-create`。

入口不会直接甩给你一份写好的设计让你批准。
它先读仓库，证据足以定下来的就直接定，并把这些决定展示给你；
其余的一轮一轮问你：先是目标和项目的条件，再是每一层做到多厚，
最后是每一层里面的具体决定。
每一轮结束，你可以改掉某个决定、继续下一轮，或者把剩下的交给 Agent。
在你批准一份列出每个文件的计划之前，什么都不会写入。

任何入口都不要求你的项目里有 `HARNESS.md`，
除非你要一份锚定文档，否则也不会在项目里留下一份。

## 校验一个文件

校验器只检查 frontmatter、标题，以及推荐章节的顺序和重复。
它不要求任何章节，也从不评判正文写得怎么样。
装了插件的话，让 Agent 替你校验即可。在本仓库的克隆里可以直接运行：

```sh
uv run skills/harness-md/scripts/lint_harness_md.py path/to/HARNESS.md
```

## 贡献 hub 条目

一个 hub 条目是放在 `hub/<name>/HARNESS.md` 里的一份设计，
可以是完整的，也可以只讲明确说明的某一个方面。
规则见 [hub/README.zh.md](hub/README.zh.md)。条目通过 pull request 提交。

## 全部 skill

| Skill | 调用方式 | 简介 |
|---|---|---|
| [`harness-md`](skills/harness-md/SKILL.md) | 模型调用 | 读、写、校验 `HARNESS.md`；附带校验脚本。 |
| [`harness-create`](skills/harness-create/SKILL.md) | 用户调用 | 给项目搭一套 harness：读仓库，和你一轮一轮定下设计，可以带参考文件，按批准的计划一层一层建。 |
| [`harness-improve`](skills/harness-improve/SKILL.md) | 用户调用 | 盘点并分析现有的 harness，报告发现的问题，再和你一起修复、加固、减薄或迁移。可以只出报告就停。 |
| [`harness-distill`](skills/harness-distill/SKILL.md) | 用户调用 | 把你项目的全部或部分 harness 写成一份或多份 `HARNESS.md`，可以如实描述，也可以写成可移植的设计。 |
| [`harness-adopt`](skills/harness-adopt/SKILL.md) | 用户调用 | 读一个你想模仿的项目，不运行其中任何东西，把它的设计写成参考，交给其他入口使用。 |
| [`harness-architecture`](skills/harness-architecture/SKILL.md) | 模型调用 | 方法论：每一层为什么存在，一条规则该放在哪里，项目背景怎样决定每一层做多少。 |
| [`environment-building`](skills/environment-building/SKILL.md) | 模型调用 | Environment 层：隔离、凭证、工具，以及 Agent 能碰到什么。 |
| [`knowledge-building`](skills/knowledge-building/SKILL.md) | 模型调用 | Knowledge 层：`AGENTS.md` 入口、知识文件，以及它们之间的指引。 |
| [`feedback-building`](skills/feedback-building/SKILL.md) | 模型调用 | Feedback 层：Agent 靠运行什么、观察什么来验证自己的工作。 |
| [`gates-building`](skills/gates-building/SKILL.md) | 模型调用 | Gates 层：拦住缺陷的提交前 Hook 和 CI 检查。 |
| [`authority-building`](skills/authority-building/SKILL.md) | 模型调用 | Authority 层：权限、提交、分支、合并、发布，以及 GitHub 或 GitLab 上的平台配置。 |
| [`completion-building`](skills/completion-building/SKILL.md) | 模型调用 | Completion 层：工作怎样定规格、怎样批准，任务怎样算做完。 |
| [`entropy-building`](skills/entropy-building/SKILL.md) | 模型调用 | Entropy 层：让 harness 始终与代码一致。 |
| [`spec-driven-development`](skills/spec-driven-development/SKILL.md) | 模型调用 | 先写规格再写代码，变更合并之前让两者始终对得上。 |
| [`openspec-workflow`](skills/openspec-workflow/SKILL.md) | 模型调用 | 在 PR 或 MR 里处理 OpenSpec 变更。 |
| [`spec-kit-workflow`](skills/spec-kit-workflow/SKILL.md) | 模型调用 | 在 PR 或 MR 里处理 Spec-Kit feature。 |
| [`lightweight-spec-workflow`](skills/lightweight-spec-workflow/SKILL.md) | 模型调用 | 不用规格框架，靠计划模式或一份 `SPEC.md` 对齐一次变更。 |
| [`project-skill-building`](skills/project-skill-building/SKILL.md) | 模型调用 | 编写和修复项目留给自己 Agent 用的 skill。 |

Claude Code 版的插件另外带两个只读的 Agent。
[`harness-verifier`](com.anthropic.claude-code/agents/harness-verifier.md)
在干净的上下文里把刚建好的 harness 重读一遍，报告缺口。
[`harness-reader`](com.anthropic.claude-code/agents/harness-reader.md)
读取外部的项目并报告所见，不执行那个项目的文件对 Agent 提出的任何要求。
Codex 和 Antigravity 的插件目前还不能包含 Agent，在这两个客户端里，
入口改用普通的子 Agent。

如果你用过
[`harness-builder`](https://github.com/hoshiori-dev/harness-builder)，
它已经由这个插件取代。

## 开发

打开开发容器，运行 `just check`。这个仓库对自己用的是同一套方法：
[HARNESS.md](.agents/knowledge/project-harness/SKILL.md) 是它的 harness 设计，
[AGENTS.md](AGENTS.md) 是 Agent 的起点。
变更怎样提出和评审，见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

Apache-2.0，见 [LICENSE](LICENSE)。
