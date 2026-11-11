---
version: alpha
name: harness.md
description: >-
  The visual design of the harness.md website: a bright, minimal reading
  surface for a file-format specification, a searchable hub of designs, and
  plugin documentation. White paper, near-black ink, one cobalt accent,
  IBM Plex type, hairlines instead of cards.
colors:
  primary: "#2446E5"
  primary-hover: "#1B37C2"
  primary-wash: "#EDF1FF"
  paper: "#FFFFFF"
  wash: "#F4F7FB"
  ink: "#14181F"
  muted: "#5A6472"
  rule: "#DCE3EC"
typography:
  display:
    fontFamily: IBM Plex Sans
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.25
  heading:
    fontFamily: IBM Plex Sans
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  subheading:
    fontFamily: IBM Plex Sans
    fontSize: 1.1875rem
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: IBM Plex Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: IBM Plex Sans
    fontSize: 0.9375rem
    fontWeight: 500
    lineHeight: 1.2
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: IBM Plex Mono
    fontSize: 0.92em
    fontWeight: 400
    lineHeight: 1.6
  mono-title:
    fontFamily: IBM Plex Mono
    fontSize: 2.25rem
    fontWeight: 500
    lineHeight: 1.25
rounded:
  xs: 2px
  sm: 4px
  md: 6px
  full: 999px
spacing:
  xs: 0.375rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  page: 72rem
  measure: 44rem
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0.625rem
  button-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0.625rem
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.paper}"
  menu:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0.375rem
  menu-item-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  tag:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 0.5rem
  tag-hover:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.primary}"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: 1rem
  code-block:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    padding: 1rem
  divider:
    backgroundColor: "{colors.rule}"
    height: 1px
---

# harness.md

## Overview

The site presents three things to developers who work with coding agents: a
short format specification, a hub of long design documents meant to be
copied, and plugin documentation. Its visitors arrive to find a file or to
read one, so the design is a reading surface first. It should feel like a
well-set technical document: bright, quiet, exact.

Three decisions carry the look. The page is white with near-black text and a
single accent, cobalt, which marks only things that can be acted on. Rows are
separated by hairlines; there are no cards, panels, or shadows on content.
And anything that is a file name, an entry name, a section heading of the
format, or code is set in a monospaced face, because the subject of the site
is a text file and the type should say so.

The home page opens with a search field over the hub, not with a slogan.
Explanation comes after the reader has been offered what they came for.

The values of record are the custom properties in
`site/src/styles/global.css`; the tokens above mirror them. When the two
disagree about a value, the stylesheet is the fact and this file is the
intent: fix the stylesheet, or change this file first.

## Colors

The palette has two neutrals for surfaces, two for text, one for lines, and
one accent with a hover shade and a tint.

- **Paper** (`#FFFFFF`) is the page. Nothing else is used as a page
  background.
- **Wash** (`#F4F7FB`) is the one quiet surface: code blocks, inline code,
  tags, the prompt box, and the hover state of neutral controls.
- **Ink** (`#14181F`) is body text, headings, and the border of neutral
  buttons and of the search field.
- **Muted** (`#5A6472`) is secondary text: descriptions, captions, labels in
  fact lists, placeholder text.
- **Rule** (`#DCE3EC`) is every hairline: row separators, the header and
  footer borders, table borders, menu borders.
- **Primary** (`#2446E5`, cobalt) means "you can act on this": links, the
  primary button, the current navigation item, focus outlines, the selected
  tag. Its hover shade (`#1B37C2`) is used only on the primary button; its
  tint (`#EDF1FF`) backs a hovered or selected tag.

The site has a light theme only. Text pairs meet WCAG AA: ink on paper and
on wash, muted on paper and on wash, primary on paper, and paper on primary.
A new colour needs a role that none of these can play; decoration is not a
role.

## Typography

Two families, both self-hosted: IBM Plex Sans for text and IBM Plex Mono for
anything that is literally text in a file. Chinese falls back to the
system's CJK sans (PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans
CJK SC), with line height opened from 1.6 to 1.75.

- **Display** (2.25rem, 600) is the page title, once per page.
- **Heading** (1.5rem, 600) and **subheading** (1.1875rem, 600) structure
  long documents. A heading inside rendered Markdown sits above a hairline.
- **Body** (1rem) is interface text; **body-lg** (1.0625rem) is running
  prose in the specification, hub entries, and documentation, where people
  read for minutes.
- **Label** (0.9375rem, 500) is the text of buttons, menu items, and
  navigation.
- **Caption** (0.8125rem) is tags and small metadata.
- **Mono** is inline code and code blocks, sized 0.92em of its context so it
  sits level with the sans beside it. **Mono-title** sets a hub entry's name
  as the title of its page, and the site's own name in the header.

Weights are 400, 500, and 600 only. Emphasis inside prose is weight 600,
never colour. Headings are sentence case.

## Layout

Content sits in one left-aligned column inside a 72rem page with a fluid
gutter (1.25rem to 2.5rem). Prose is held to a 44rem measure so lines stay
readable; tables and code blocks may use the measure in full and scroll
horizontally inside their own box, never the page.

Long documents (the specification, a hub entry, a documentation page) get a
narrow contents list beside the text on wide screens, collapsed above it on
narrow ones. Lists of things (hub entries, search results, links to go next)
are rows with a hairline between them, each row a title and one or two lines
of muted text.

Spacing follows a short scale: 0.375rem between tags, 0.5rem between an icon
and its label, 1rem inside boxes, 1.5rem between blocks, 2.5rem and up
between sections. Space, not a box, separates one group from the next.

The layout holds at 390px: navigation wraps under the site name, the
contents list collapses, tables scroll in place, and menus stay inside the
viewport.

## Elevation & Depth

The page is flat. Hierarchy comes from type size, weight, hairlines, and
space. There is exactly one shadow, on an open dropdown menu
(`0 8px 24px` of ink at 10%), because a menu really does sit above the page
and has to read that way. Nothing else floats: no raised cards, no sticky
shadows, no overlays other than menus.

## Shapes

Corners are small and consistent: 6px on buttons, fields, menus, and code
blocks; 4px on inline code; 2px on focus outlines. Tags alone are fully
rounded, which is what makes them read as tags and not as buttons. Borders
are 1px. Icons are line icons on a 24-unit grid with a 2-unit stroke, drawn
at 16px in the current text colour.

## Components

**Button.** A neutral button is paper with a 1px ink border and ink text; it
takes the wash on hover. The primary button is cobalt with white text and is
used once in a view, for the action the page exists for (copying a prompt).
A button that performs an action carries an icon before its label.

**Split button and menu.** Page actions are one split control near the page
title: the main part does the most likely thing (copy the page as Markdown),
and a caret opens a menu with the rest (view as Markdown in a new tab,
download, view on GitHub). Every menu item is an icon and a label. The menu
is paper with a hairline border, 6px corners, and the one shadow; the
hovered or focused item takes the wash. Menus open on click or from the
keyboard, close on Escape or an outside click, and only one is open at a
time.

**Language menu.** In the header: a globe icon, the current language's own
name, a caret. The menu lists every language by its own name with a check
beside the current one. It is a menu, not a toggle, so a third language
needs no redesign.

**Search field.** The largest control on the home page: full width of the
column, 1px ink border, 6px corners, body-lg text, a placeholder that says
what is searched. Results appear below it as rows.

**Tag.** A small fully rounded label on the wash. Where a tag filters or
links, it turns to the primary tint and cobalt text on hover, and stays that
way while selected.

**Prompt box.** On a hub entry: a block on the wash with a hairline border
that shows the text to paste into an agent, an open area beneath it where
the reader types their own requirements, and the primary button to copy
both. It is the only place a text area appears.

**Rendered Markdown.** Headings, paragraphs, lists, tables, and code from
the specification and hub entries. Tables have hairline row borders and a
heavier ink line under the header. Code blocks are on the wash with a
hairline border. Links are cobalt and underlined.

**Fact list.** Label and value pairs under an entry's title (tags, licence,
format version, provenance): muted label, ink value, no borders.

## Do's and Don'ts

- Do use cobalt only for things that can be clicked or that show focus or
  selection.
- Do set file names, entry names, section names of the format, and code in
  the monospaced face.
- Do separate items with a hairline or with space.
- Do give every action an icon and a label, and group related actions in one
  menu.
- Do keep long text at the 44rem measure.
- Don't add a second accent colour, a gradient, or a dark surface.
- Don't put content in cards, and don't add shadows to anything but an open
  menu.
- Don't use an icon without a label unless the control has an accessible
  name and its meaning is conventional (a caret that opens a menu).
- Don't use emoji, illustration, or decorative imagery.
- Don't load fonts, scripts, or styles from another origin.
- Don't translate the format's section names, in any language.
