# HARNESS.md Hub

[English](README.md)

Hub 收集现成的 `HARNESS.md` 文件。每一份都是为某一类项目写好的完整 Agent
harness 设计，放进仓库，交给编码 Agent 就能照着搭建。

所有条目都遵循 [HARNESS.md 格式](../spec/spec.zh.md)，也可以在
[网站](https://hoshiori-dev.github.io/harness.md/zh/)上浏览和搜索。

## 条目

| 条目 | 适用于 |
| --- | --- |
| [exploratory-prototype](exploratory-prototype/HARNESS.md) | 原型、演示或实验：一个人，Agent 每一轮都有人看着，代码一个季度内就会丢弃。有意做得很薄。 |
| [production-engineering](production-engineering/HARNESS.md) | 团队维护多年的生产代码库，改错了会影响用户、数据或资金。harness 的每一层都写全了，并由机器强制执行。 |
| [solo-open-source-library](solo-open-source-library/HARNESS.md) | 一位维护者、接受外部贡献的公开库。守住公开 API 和发布，其余地方流程从简。 |

## 使用条目

1. 挑一份 Context 章节最接近你项目的条目。先读 Context：它列出了这份设计默认
   成立的条件，建立在错误前提上的设计不是太重就是太轻。
2. 把文件复制到仓库根目录，命名为 `HARNESS.md`：

   ```sh
   curl -fsSL -o HARNESS.md \
     https://raw.githubusercontent.com/hoshiori-dev/harness.md/main/hub/production-engineering/HARNESS.md
   ```

3. 在仓库里打开你的编码 Agent，告诉它这个项目是做什么的，然后让它按
   `HARNESS.md` 搭建 harness。例如：“这是一个用 Go 写的支付 API，每周部署
   一次。请按 HARNESS.md 的描述搭建 Agent harness。”

每个条目开头都有一节“How to use this file”，告诉 Agent 接下来做什么：拿
Context 对照你的项目，问清它看不到的事，给你看计划，等你同意后才动手。不需要
安装任何插件，从没听说过这个格式的 Agent 也能照着文件做。

harness 建好之后，这份文件怎么处理由你决定。可以删掉，harness 不依赖它。也
可以留下来作为项目的设计文档，以后改动 harness 时拿它对照。要留的话，先把
Context 改写成你自己项目的情况，不要保留条目假设的那个通用项目。

条目只是起点，搭建前后都可以随意修改。一份大体合适、经你调整过的条目，比原样
照搬的更好。

## 条目规则

条目放在 `hub/<name>/HARNESS.md`。除格式本身之外，hub 还有以下要求。

- 目录名与 frontmatter 里的 `name` 相同。
- frontmatter 包含 `name`、`description`、`version: alpha`、
  `license: Apache-2.0` 和 `metadata.tags`。`tags` 是一个非空列表，由小写、
  连字符连接的词组成，用于筛选。可以有 `metadata.based-on`，列出这份条目
  所依据的设计或资料的 URL。不得有其他顶层键。
- `description` 说明这份设计是什么、适合哪一类项目，不超过 1024 个字符。搜索
  会读它，所以要用找这类设计的人会输入的词。
- 正文用英文。
  校验器不报错误，也不报警告，
  也就是说正文有且只有一个标题，推荐章节的顺序正确。
- 单凭这一份文件就能把 harness 建出来。它写明要创建哪些文件、各放什么，写明
  命令、各项检查和它们的阈值、权限规则，并给出每个决定的理由，决定不做的事也
  一样。
- 条目是通用的，不提任何私有项目，不含机密。
- References 里列出的资料，作者都确实读过。

`tags` 和 `based-on` 是这个 hub 自己的约定，不属于 HARNESS.md 格式；格式不
理会 `metadata` 下的任何内容。

## 贡献条目

新增条目和修改现有条目都走普通的 pull request。合并前要满足两点：校验器通过，
维护者评审过实质内容。

评审的时间主要花在实质内容上。新条目应当面向现有条目照顾不好的一类项目，做出
的决定也要和它们不一样，不能只是同样的决定换一种说法。最好在 pull request 里
写明这份设计用在了哪个项目上，看过 Agent 照它搭建之后你又改了什么。

在本地检查条目，从仓库根目录运行下面的命令。它会对每个条目运行格式校验器，并
检查 hub 自己的规则：

```sh
just hub-check
```
