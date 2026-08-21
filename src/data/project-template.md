---
# Required on every project.
title: Project name
summary: One sentence, read in four seconds. What it is and what made it hard.
year: '2026' # A string, so ranges like '2025-Present' work.
platform: Roblox # Comma separated. Each one becomes a tag pill.
language: Luau # Comma separated. Each one becomes a tag pill.
status: live # live | in progress | archived
order: 9 # Position on the homepage, low first.

# Which page shape to use. Changes the hero split, the shot grid, and the
# heading above the shots.
#   app    window chrome on the hero, masonry shots, "Inside the app"
#   game   key art hero, full width stat band, "In game"
#   engine narrow copy against wide media, 2x2 shots, "Benchmark"
layout: app

# Required. frames is the image rotation, 1 to 4 of them. With video set, the
# video plays instead and frames[0] is only used as the homepage card image.
hero:
  alt: Required. Describe what is in the image, not that it is an image.
  frames:
    - /media/placeholder-wide.svg
  # video: /media/example.mp4
  # poster: /media/example-poster.jpg
  # note: Caption under the hero media. Good place for recording caveats.
  # fit: cover # cover | contain. contain pads the image instead of cropping.

# Only worth setting when a reader would otherwise assume a team. Left out, the
# meta line is just the status and the year.
role: Solo Developer

# The big numbers. Any value that starts with a digit counts up on scroll.
highlights:
  - value: 10.9M
    label: visits

# One line of numbers under the card on the homepage.
stat: 10.9M visits / 95% likes

# Buttons in the hero. Both optional, both must be full URLs.
source: https://github.com/RakkenTi/example
play: https://example.com

# The body below the frontmatter becomes /writeups/<slug>/. Leave the body
# empty and no write-up page is generated and no button appears.
writeup:
  title: Optional. Heading on the write-up page, defaults to the project title.
  cta: Optional. Button label, defaults to "Read more".

# Which blocks render under the hero, in this order. Drop one to hide it.
#   shots    the image gallery, needs shots below
#   funnel   the drop-off bars, needs funnel below
#   metrics  the numbers panel, needs metrics below
#   writeup  the write-up button, moves it out of the hero to here
sections:
  - shots
  - funnel

# How the shots render. grid follows the layout above, marquee is a single
# row that scrolls sideways forever and pauses on hover.
gallery: grid

shots:
  - src: /media/placeholder-wide.svg
    alt: Required. Describe what is in the image, not that it is an image.
    caption: Optional.

# Bars showing how far people get. Every share is measured against the first
# step, so put the largest number first. Needs at least two steps.
funnel:
  heading: How far players get
  note: Optional. Where the numbers came from and when.
  steps:
    - label: The Start
      count: 6197141
    - label: Beat the game
      count: 59170

# One table per machine. Values are strings so units come along for the ride,
# and every row must have exactly as many values as there are columns or the
# build fails and tells you which row is short. If a column has FPS in its
# name, values at or above fpsFloor are picked out in the accent colour.
metrics:
  heading: Benchmarks
  note: Optional. Test conditions, or what the numbers do not cover.
  fpsFloor: 60 # Optional, defaults to 60.
  columns:
    - Entities
    - Avg FPS
    - Frame time
  machines:
    - name: Desktop
      score: '20,777' # Optional, sits at the right of the strip.
      system:
        - label: CPU
          value: Ryzen 7 5800X, 16 threads
      rows:
        - label: Base
          values: ['500', '1,133.55', 0.882 ms]
        - label: Extreme
          tag: shown above # Optional pill, for tying a row to a clip.
          values: ['48,519', '62.01', 16.127 ms]
---

Copy this file into `src/data/projects/`, rename it, and delete every optional
field you are not using. The schema in `src/content.config.ts` is the real
source of truth, and it fails the build on anything it does not recognise, so a
typo here is caught rather than silently ignored.

Everything below the frontmatter is the write-up, and it is optional. Leave it
out and the project still gets a page with the hero, the shots, and the numbers.
Include it and it becomes a second page at `/writeups/<slug>/` with a button
pointing at it.

## The problem

What you were trying to do, and why the obvious approach was not good enough.

## What I built

The thing itself, in plain terms.

## How it works

The one or two decisions that were genuinely yours. Specificity is what
separates this from a tutorial writeup.

## What I would change

A real limitation and what you would do about it.
