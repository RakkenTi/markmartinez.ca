---
title: tohki
summary: A tiny dependency-free Rust tokenizer that converts source code into typed tokens, used for syntax highlighting.
year: '2026'
platform: Library
language: Rust
layout: app
status: live
order: 6
hero:
  alt: Tohki diagrams showing source classification, token details, and language definition fields.
  frames:
    - /media/tohki-highlight.svg
    - /media/tohki-card.svg
    - /media/tohki-language.svg
  fit: cover
source: https://github.com/RakkenTi/tohki
crates: https://crates.io/crates/tohki
features:
  - src: /media/tohki-highlight.svg
    alt: Source code broken into typed tokens, with each token's kind, byte range, and text shown in a table.
    title: Tohki
    text: Tohki reads source text and returns a token for each fragment. These tokens contain metadata whose usage is up to the implementation/consumer.
  - src: /media/tohki-card.svg
    alt: Source code shown above a token table with each token's kind, byte range, and text.
    title: Token definition
    text: A token is composed of the kind, byte range, and source text of each fragment.
  - src: /media/tohki-language.svg
    alt: A Rust language definition listing names, comment markers, quotes, keywords, types, and constants.
    title: Language Structure
    text: A language is defined by its names, comments, quotes, keywords, types, and constants.
related:
  slug: mdre
  title: See its usage in mdre
  text: mdre uses tohki to provide syntax highlighting for code blocks!
  cta: Open mdre
sections:
  - features
---
