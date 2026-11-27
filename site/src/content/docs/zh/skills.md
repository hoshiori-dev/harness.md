---

title: Skill 与 Agent
description: harness-md 附带的格式 skill、方法论手册、七个分层 builder、日常 skill，以及两个只读的 Agent。
order: 3
---

除了四个入口，插件里的其他 skill 会在任务需要时自动加载。

## 格式 skill

`harness-md` 这个 skill 与插件同名，负责读、写和校验 `HARNESS.md`。
它带着三样东西：一份[规范](../../spec/)的副本；
一套写作标准，说明一节要写到什么程度，读者才能单凭文件开展工作；
还有校验脚本。
它不默认文件应该放在你项目的根目录：
只有项目自己选定时，一份文件才是这个项目的锚定文档。

校验器只检查单个文件的格式：frontmatter、标题，以及推荐章节的顺序和重复。
它不要求任何章节。它不评判正文写得怎样，插件里也没有比较两份文件的工具。

## 方法论手册

`harness-architecture` 解释每一层为什么存在，一条规则该放在哪里，
以及项目的 Context 怎样决定每一层要做多厚。对方法有疑问时可以问它；
动手建的是工作流和 builder。

## 七个分层 builder

harness 的每一层对应一个 builder。builder 知道这一层怎样做决定、怎样建、怎样检查；
这一层必须定下来的每个决定，它都备有推荐做法。这些名字不用记：
每一层该用哪个 builder，入口会替你选。

| Builder                | 层          | 这一层管什么                                             |
| ---------------------- | ----------- | -------------------------------------------------------- |
| `environment-building` | Environment | Agent 在哪里运行，手里有哪些工具，能碰到什么             |
| `knowledge-building`   | Knowledge   | 入口文件、知识文件，Agent 什么时候读什么                 |
| `feedback-building`    | Feedback    | Agent 能运行和观察什么来验证自己的工作                   |
| `gates-building`       | Gates       | 确定性的检查：Agent 自己没验证过的缺陷，它们也会拦住     |
| `authority-building`   | Authority   | Agent 可以不问就做什么，以及它怎样提交、分支、合并和发布 |
| `completion-building`  | Completion  | 动手之前怎样对齐目标，怎样算做完                         |
| `entropy-building`     | Entropy     | 怎样让 harness 与代码保持一致                            |

builder 有四种模式。**decide** 交回这一层该做到多厚，以及这一层的各项决定，
每一项要么已由证据定下，要么留待选择并附上选项；
**describe** 把项目现在的做法写下来；
**build** 按你同意的决定创建文件，也只有这个模式会往项目里写东西；
**audit** 报告发现的问题，不改任何东西。

你也可以直接要某一层，比如“给这个仓库把检查配起来”；
这时 builder 先把证据足以定下的决定展示给你，其余的问你，
等你认可它展示的内容之后，再动手写文件。

## 日常 skill

这些 skill 用在已经有 harness 的项目里。

| Skill                       | 用途                                              |
| --------------------------- | ------------------------------------------------- |
| `spec-driven-development`   | 先写规范再写代码，并按这个流程走完一次变更        |
| `openspec-workflow`         | 创建、校验和归档 OpenSpec 变更                    |
| `spec-kit-workflow`         | 用 Spec-Kit 把一次变更从规范做到代码              |
| `lightweight-spec-workflow` | 不用框架，靠计划模式或一份 `SPEC.md` 对齐一次变更 |
| `project-skill-building`    | 编写和修复项目留给自己 Agent 用的 skill           |

## 两个 Agent

两个 Agent 都是只读的。

`harness-verifier` 在 harness 建好或改动之后把它重读一遍。
入口把新文件交给它，每个文件附一行意图。
它在干净的上下文里读这些文件，就像一个没见过构建过程的 Agent 那样，
然后报告自己会怎样理解，以及文件之间哪里互相矛盾。

`harness-reader` 读取来自外部的项目，
用于 `harness-adopt`，或者参考对象是一整个项目的时候。
它报告那个项目的 harness 由什么组成，
列出那个项目的文件对 Agent 提出的每一条要求，但一条都不执行。

它们只随 Claude Code 分发，因为 Codex 和 Antigravity 的插件格式里没有放 Agent 的位置。
在这两个客户端里，入口会另找一个干净上下文的子 Agent 来读；
找不到的话，就由 Agent 自己来读，并在报告里说明。
