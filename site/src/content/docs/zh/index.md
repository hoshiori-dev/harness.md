---

title: harness-md 插件
description: harness-md 插件做什么，怎样安装到 Claude Code、Codex 和 Antigravity，以及你的情况该用哪个工作流。
order: 1
---

`harness-md` 是一个给编码 Agent 用的插件。
它围绕一份文档展开，也就是项目的 `HARNESS.md`，里面记录的是项目的 harness 设计。
harness 指项目为编码 Agent 做的全部安排：
Agent 在哪里运行，读什么，怎样检查自己的工作，什么会拦住一次错误的改动，
哪些事它可以不问就做。插件里的每个 skill，要么写这份文档，要么读它，
要么把它变成能用的 harness。

用 `HARNESS.md` 不一定要装插件。
这个格式的设计目标就是让什么都没装的 Agent 也能读懂文件并照着建，
见[不装插件使用 HARNESS.md](without-plugin/)。插件多给你的是三样东西：
固定的流程，格式校验器，以及七个 builder skill。
harness 分成七层
（Environment、Knowledge、Feedback、Gates、Authority、Completion、Entropy），
每个 builder 知道其中一层怎样设计、怎样建、怎样检查。

## 安装

插件采用 Agent Plugins 1.0.0 的布局，可以在三个客户端里加载。

**Claude Code**

```text
/plugin install harness-md --marketplace hoshiori-dev/harness.md
```

Claude Code 2.1.275 及以上版本一步完成。
更早的版本先运行 `/plugin marketplace add hoshiori-dev/harness.md`，再安装。

**Codex**

```sh
codex plugin marketplace add hoshiori-dev/harness.md
codex plugin add harness-md@harness-md
```

**Antigravity**

```sh
agy plugin install https://github.com/hoshiori-dev/harness.md
```

随 skill 分发的脚本是用 Python 写的，
要靠 [uv](https://docs.astral.sh/uv/) 运行，所以请先装好 uv。
脚本声明的依赖由 uv 自动取回，你的项目不用另外准备 Python 环境。

## 该用哪个工作流

有四个 skill 是工作流，只有你点名要用时才会运行。

| 你的情况                                                | 运行                                                                                   |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 新项目，还没有 harness                                  | `harness-design`，然后 `harness-build`                                                 |
| 已有的项目，Agent 在里面干得很吃力，还没有 `HARNESS.md` | 先用 `harness-audit` 找出问题，然后 `harness-design`，再 `harness-build`               |
| harness 已经能用，只是某件事老出错                      | 带着具体症状运行 `harness-audit`，再用 `harness-design` 修订设计，最后 `harness-build` |
| 想把一个项目的 harness 写成文档，自己的或者想学习的     | `harness-extract`                                                                      |
| 手里有一份 `HARNESS.md`，想让项目与它一致               | `harness-build`                                                                        |

[四个工作流](workflows/)逐个介绍它们。
插件里的其他内容见 [Skill 与验证 Agent](skills/)。
