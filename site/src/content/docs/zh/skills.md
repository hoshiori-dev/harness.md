---

title: Skill 与验证 Agent
description: harness-md 附带的格式 skill、方法论手册、七个分层 builder、日常 skill，以及只读的验证 Agent。
order: 3
---

除了四个工作流，插件里的其他 skill 会在任务需要时自动加载。

## 格式 skill

`harness-md` 这个 skill 与插件同名，负责读、写和校验 `HARNESS.md`。它带着三样东西：一份[规范](../../spec/)的副本；一套写作标准，说明一节要写到什么程度，才能单凭文件把 harness 建出来；还有校验脚本。

校验器只检查单个文件的格式：frontmatter、必选章节、章节顺序。它不评判正文写得怎样，插件里也没有比较两份文件的工具。

## 方法论手册

`harness-architecture` 解释每一层为什么存在，一条规则该放在哪里，以及项目的 Context 怎样决定每一层要做多厚。对方法有疑问时可以问它；动手建的是工作流和 builder。

## 七个分层 builder

harness 的每一层对应一个 builder。builder 知道这一层怎样设计、怎样建、怎样检查；这一节必须定下来的每个决定，它都备有默认值。这些名字不用记：每一层该用哪个 builder，工作流会替你选。

| Builder                | 层          | 这一层管什么                                             |
| ---------------------- | ----------- | -------------------------------------------------------- |
| `environment-building` | Environment | Agent 在哪里运行，手里有哪些工具，能碰到什么             |
| `knowledge-building`   | Knowledge   | 入口文件、知识文件，Agent 什么时候读什么                 |
| `feedback-building`    | Feedback    | Agent 能运行和观察什么来验证自己的工作                   |
| `gates-building`       | Gates       | 确定性的检查：Agent 自己没验证过的缺陷，它们也会拦住     |
| `authority-building`   | Authority   | Agent 可以不问就做什么，以及它怎样提交、分支、合并和发布 |
| `completion-building`  | Completion  | 动手之前怎样对齐目标，怎样算做完                         |
| `entropy-building`     | Entropy     | 怎样让 harness 与代码保持一致                            |

builder 有四种模式。**design** 把这一层的章节写成正文交回；**extract** 描述项目现在的做法；**build** 创建文件，也只有这个模式会往项目里写东西；**audit** 报告项目和章节在哪里不一致。

你也可以直接要某一层，比如“给这个仓库把检查配起来”；这时 builder 先起草这一层的章节，等你批准一次，再动手写文件。

## 日常 skill

这些 skill 用在已经有 harness 的项目里。

| Skill                       | 用途                                              |
| --------------------------- | ------------------------------------------------- |
| `spec-driven-development`   | 先写规范再写代码，并按这个流程走完一次变更        |
| `openspec-workflow`         | 创建、校验和归档 OpenSpec 变更                    |
| `spec-kit-workflow`         | 用 Spec-Kit 把一次变更从规范做到代码              |
| `lightweight-spec-workflow` | 不用框架，靠计划模式或一份 `SPEC.md` 对齐一次变更 |
| `project-skill-building`    | 编写和修复项目留给自己 Agent 用的 skill           |

## 验证 Agent

`harness-verifier` 是一个只读的 Agent。构建结束后，工作流把新文件交给它，每个文件附一行意图。它在干净的上下文里读这些文件，就像一个没见过构建过程的 Agent 那样，然后报告自己会怎样理解，以及文件之间哪里互相矛盾。

它只随 Claude Code 分发，因为 Codex 和 Antigravity 的插件格式里没有放它的位置。在这两个客户端里，工作流会另找一个干净上下文的子 Agent 来读；找不到的话，就由 Agent 自己从头重读一遍。
