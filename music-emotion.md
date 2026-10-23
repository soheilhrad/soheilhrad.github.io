---
layout: project
title: Hear a feeling
seo_title: "Hear a feeling: turn an emotion word into music"
description: "Type a word for a feeling in English, Spanish or Persian, or touch a map of feelings, and hear it as a short phrase of music played on recorded instruments."
lede: "Type a word for a feeling, or touch the map, and hear it as a short phrase of music."
decision: "A feeling is a place, not a label. Every feeling sits on one map, so feelings that are close sound alike, and words like “very”, “a bit” and “not” simply move the point."
permalink: /projects/music-emotion/
ref: music-emotion
cta_label: Try it
cta_url: /#taf-title
last_modified_at: 2026-10-19
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **One input and one map.** Type a feeling in English, Spanish or Persian, or tap or drag on the map: every spot plays its own phrase. Hovering shows what a spot would be before it plays.
- **Change it by typing.** "very sad" moves the point outward, "a bit sad" inward, "not happy" across to the other side, and "sad and hopeful" lands between the two.
- **Played on real instruments.** Piano, strings, flute and others, recorded note by note. The same word always gives the same phrase.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_why }}</summary>

- **Where a feeling sits.** People have rated thousands of English words for how pleasant they feel and how calm or intense. Each feeling on the map sits where its word was rated: more pleasant to the right, more intense towards the top.
- **How it sounds.** Decades of music research agree on a handful of cues. Sad music tends to be slow, low and in a minor key; joyful music quicker, brighter and in a major key; calm music has few, soft notes. As you move across the map, the page turns those cues up and down.
- **What we chose.** Which instrument plays which feeling, how far "very" and "a bit" move a point, and the exact size of each step are design choices, not findings.
- **A sketch, not a test.** It is built from published findings and has not been tested with listeners. Most of those findings come from Western listeners and Western music.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_credits }}</summary>

- **The map:** Russell's circumplex model (1980), with word ratings from Warriner, Kuperman and Brysbaert (2013).
- **The sound:** the cue reviews by Juslin and Laukka (2003) and Gabrielsson and Lindström (2010), and Eerola, Friberg and Bresin (2013). The feelings draw on the Geneva Emotional Music Scale (Zentner and colleagues, 2008) and Hevner's adjective clusters (1936). Full references are under "{{ t.feeling.research }}" on the home page.
- **The instruments:** single-note recordings from VSCO 2 Community Edition (Versilian Studios, released as CC0), in the web edition by N. P. Brosowsky (tonejs-instruments, CC BY 3.0).

</details>
