---

title: harness-md 插件
description: harness-md 插件做什么，怎样安装到 Claude Code、Codex 和 Antigravity，以及你的情况该用哪个入口。
order: 1
---

`harness-md` 是一个给编码 Agent 用的插件。
有了它，你和 Agent 可以一起把项目的 harness 定出来、建起来。
harness 指项目为编码 Agent 做的全部安排：
Agent 在哪里运行，读什么，怎样检查自己的工作，什么会拦住一次错误的改动，
哪些事它可以不问就做。

插件关心的是 harness，而不是某份文档。
`HARNESS.md` 是 harness 设计的可移植形式：
插件把它当参考来读，在你想分享或留存设计时把它写出来，
但从不要求你的项目里有一份。

用 `HARNESS.md` 不一定要装插件。
这个格式的设计目标就是让什么都没装的 Agent 也能读懂文件并据此工作，
见[不装插件使用 HARNESS.md](without-plugin/)。插件多给你的是三样东西：
一步一步和你一起做决定的方式，格式校验器，以及七个 builder skill。
harness 分成七层
（Environment、Knowledge、Feedback、Gates、Authority、Completion、Entropy），
每个 builder 知道其中一层怎样做决定、怎样建、怎样检查。

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

## 该用哪个入口

有四个 skill 是入口，只有你点名要用时才会运行。

| 你的情况                                          | 运行                                                         |
| ------------------------------------------------- | ------------------------------------------------------------ |
| 项目还没有 harness，不管是新项目还是老项目        | `harness-create`                                             |
| 同上，而且手里有 hub 或别的团队的设计可以参考     | `harness-create`，附上文件的地址或路径                       |
| Agent 在现有的 harness 里干得吃力，或某件事老出错 | `harness-improve`                                            |
| 只想知道哪里有问题                                | `harness-improve`，看完报告就停                              |
| 原型正在变成产品                                  | `harness-improve`                                            |
| 想把自己项目的设计写下来，用来分享或留存          | `harness-distill`                                            |
| 想要一套和另一个项目类似的 harness                | 先 `harness-adopt`，再 `harness-create` 或 `harness-improve` |

[四个入口](workflows/)逐个介绍它们，以及它们怎样和你一起做决定。
插件里的其他内容见 [Skill 与 Agent](skills/)。
