---

title: 四个工作流
description: harness-design、harness-build、harness-extract 和 harness-audit 各自做什么，做完留下什么。
order: 2
---

工作流是插件的入口。每个工作流都是需要你自己调用的 skill：即使某句话听起来很像，Agent 也不会自行启动它。在 Claude Code 里把 skill 当命令输入，例如 `/harness-md:harness-design`；在 Codex 里写 `$harness-design`；在 Antigravity 里，在请求中写出 skill 的名字。

四个工作流遵守三条共同的规则。第一，仓库里看得出来的，Agent 自己去读；看不出来的，一次问完。然后它起草完整的设计，每个决定都带一个默认值和理由，你只需要批准一次，不用一个决定一个决定地回答。第二，在你批准相应的设计之前，项目里不会新增或改动任何文件。第三，批准设计只是同意它写到的那些文件。向仓库之外发布内容、修改远端设置、删掉已经做好的东西、放宽 Agent 可以自行做的事，每一项都要等工作流做到那一步时，再单独征得你的同意。

## harness-design

产出项目的 `HARNESS.md`，或者修订已有的那份。

新项目从你的目标出发，已有项目从仓库现在的做法出发。如果你贴进来的是 hub 里的文件，它先按你的项目重写 Context 一节（这一节描述设计必须适应的条件），再看哪些章节的理由建立在原来的 Context 上，把这些章节重新考虑一遍。

产出是仓库根目录下的一份 `HARNESS.md`，已经通过校验器的检查。

## harness-build

把 `HARNESS.md` 变成 harness：入口文件、知识文件、检查、权限文件等等。这份文件可以是你一分钟前贴进来的模板，也可以是项目的锚定文档，也就是长期留在仓库里、很少改动的那份设计记录。项目里已经有 harness 时，工作流会把它改得与设计一致。

它一层一层地建。层是文件描述的 harness 的七个部分，按章节的顺序依次是 Environment（运行环境）、Knowledge（知识）、Feedback（反馈）、Gates（检查关卡）、Authority（权限）、Completion（完成标准）、Entropy（防止漂移）。Invariants、Style 和 File Structure 不是层，工作流把其中的每条规则交给能落实它的那一层。如果设计要求的某件事在这个仓库里做不到，工作流会跳过这一项，报告冲突，把其余的建完。

最后由你决定 `HARNESS.md` 是留作锚定文档，还是删掉。

## harness-extract

读一个项目，写出描述它现有 harness 的 `HARNESS.md`。这个项目可以是你自己的，也可以是你想学习的别人的项目。

结果描述的是 harness 现在的样子。凡是意图靠推测得来的地方，它会标明是推测。

## harness-audit

诊断一个 harness 并报告发现，不改动任何文件。它检查三件事：

1. `HARNESS.md` 是否符合规范；
2. 设计和产物（实现设计的那些文件）在哪些地方已经对不上；
3. 按项目的 Context 来看，这份设计是否还合适。

每条发现都给出证据，并说明该改哪一边：改产物，还是改设计。
