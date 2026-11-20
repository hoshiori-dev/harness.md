# HARNESS.md Hub

[English](README.md)

Hub 收集现成的 `HARNESS.md` 文件。
每一份都是为某一类项目写好的 Agent harness 设计，
可以是完整的一套，也可以只讲其中一个方面。
把它作为参考交给编码 Agent，和它一起定出你项目的 harness。

所有条目都遵循 [HARNESS.md 格式](../spec/spec.zh.md)，
也可以在 [网站](https://hoshiori-dev.github.io/harness.md/zh/)上浏览和搜索。

## 条目

| 条目 | 适用于 |
| --- | --- |
| [exploratory-prototype](exploratory-prototype/HARNESS.md) | 原型、演示或实验：一个人，Agent 每一轮都有人看着，代码一个季度内就会丢弃。有意做得很薄。 |
| [production-engineering](production-engineering/HARNESS.md) | 团队维护多年的生产代码库，改错了会影响用户、数据或资金。harness 的每一层都写全了，并由机器强制执行。 |
| [solo-open-source-library](solo-open-source-library/HARNESS.md) | 一位维护者、接受外部贡献的公开库。守住公开 API 和发布，其余地方流程从简。 |

## 使用条目

1. 挑一份 Context 章节最接近你项目的条目。先读 Context：
   它列出了这份设计默认成立的条件，建立在错误前提上的设计不是太重就是太轻。
2. 在你的仓库里打开编码 Agent，把条目的地址给它，
   并告诉它这个项目是做什么的。例如：
   “这是一个用 Go 写的支付 API，每周部署一次。请阅读
   https://raw.githubusercontent.com/hoshiori-dev/harness.md/main/hub/production-engineering/HARNESS.md
   作为参考，和我一起为这个项目设计 Agent harness。
   在提出任何方案之前，先告诉我它的 Context 有哪些地方对不上；
   在写任何文件之前，先给我看计划。”
3. 逐项看 Agent 提出的方案。理由在你的项目里成立的决定就保留，
   前提与你不同的决定就改掉，计划经你同意之后再动手搭建。

文件不必放进你的仓库，用完也不需要留着：harness 不依赖它。
可以同时给 Agent 不止一个条目，比如一份完整的设计，
再加一份把某个方面讲得更深的部分设计。

条目是供权衡的设计，不是一串命令。
它把每个决定和理由写出来，让你和 Agent 能判断哪些合用。
不需要安装任何插件，从没听说过这个格式的 Agent 也能读懂文件。

条目只是起点。
一份大体合适、按你的项目调整过的条目，比原样照搬的更好。

## 条目规则

条目放在 `hub/<name>/HARNESS.md`。除格式本身之外，hub 还有以下要求。

- 目录名与 frontmatter 里的 `name` 相同。
- frontmatter 包含 `name`、`description`、
  `license: Apache-2.0` 和 `metadata.tags`。
  `tags` 是一个非空列表，由小写、连字符连接的词组成，用于筛选。
  可以有 `metadata.based-on`，列出这份条目所依据的设计或资料的 URL。
  不得有其他顶层键。
- `description` 说明这份设计是什么、适合哪一类项目，不超过 1024 个字符。
  搜索会读它，所以要用找这类设计的人会输入的词。
- 正文用英文。校验器不报错误，也不报警告，也就是说正文有且只有一个标题，
  推荐章节的顺序正确。
- 条目覆盖一套完整的 harness，或者明确说明的其中一部分。
  `description` 和导言要写明是哪一种，
  部分条目还要说明哪些内容留给读者自己设计。
- 条目自身是充分的：没装插件的 Agent 单凭它就能设计并搭建 harness。
  它写明每个决定、理由和所依据的前提，决定不做的事也一样。
  文件名、命令、工具和阈值只作为决定的示例给出，不能代替决定本身。
- 条目在哪里读到就能在哪里用。
  它不要求读者把它放到项目根目录，保留或删除文件也不是使用它的步骤。
  关于用法的说明要简短，具体怎么设计和搭建留给读者。
- 条目是通用的，不提任何私有项目，不含机密。
- References 里列出的资料，作者都确实读过。

`tags` 和 `based-on` 是这个 hub 自己的约定，不属于 HARNESS.md 格式；
格式不理会 `metadata` 下的任何内容。

## 贡献条目

新增条目和修改现有条目都走普通的 pull request。合并前要满足两点：
校验器通过，维护者评审过实质内容。

评审的时间主要花在实质内容上。新条目应当面向现有条目照顾不好的一类项目，
做出的决定也要和它们不一样，不能只是同样的决定换一种说法。
最好在 pull request 里写明这份设计用在了哪个项目上，
看过 Agent 照它搭建之后你又改了什么。

在本地检查条目，从仓库根目录运行下面的命令。
它会对每个条目运行格式校验器，并检查 hub 自己的规则：

```sh
just hub-check
```
