---
layout: project
title: Hear a feeling
description: "Type a word for a feeling in English, Spanish or Persian, or touch a map of feelings, and hear a short phrase of music. The map is placed from word ratings; the labels are checked against how listeners rated Persian classical music."
lede: "Type a word for a feeling, or touch the map, and hear a phrase built from the cues research links to it. The map is placed from how people rated the words; the labels are checked against a listening study of Persian classical music."
decision: "Hearing an emotion and feeling it are not the same thing, so the page keeps them apart: what the music says, and what you feel."
permalink: /projects/music-emotion/
ref: music-emotion
cta_label: Try it
cta_url: /#taf-title
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **One input and one map.** Type a feeling in English, Spanish or Persian, or tap or drag on the map: every spot plays its own phrase. Hovering shows what a spot would be before it plays.
- **Change it by typing.** "very sad" moves the point outward, "a bit sad" inward, "not happy" across to the other side, and "sad and hopeful" lands between the two.
- **Built from cues, played on real instruments.** Mode, tempo, register, brightness, timing and loudness make the music, and recorded piano, strings, flute and others play it. The same word always gives the same phrase.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_result }}</summary>

In a listening study, 20 people with no professional music training heard nine pieces of Persian classical music: three chosen as happy, three as sad and three as both at once, plus six filler sounds (rain, wind, the sea and the like). After each piece they rated, from 1 to 5, what the music expressed and what they felt.

| Piece type | Heard as happy | Heard as sad |
|---|---|---|
| Happy | 4.1 | 1.4 |
| Sad | 1.3 | 4.0 |
| Mixed | 2.9 | 2.0 |

- **Hearing and feeling moved together.** Hearing happiness went with feeling joyful (0.86) and energized (0.82); hearing sadness went with feeling sad (0.81). What people felt usually matched what they heard or fell below it.
- **The saddest music moved people most** (0.34), and wonder, nostalgia and being moved formed a family of their own, only weakly tied to happy versus sad.
- **Anger, fear and anxiety barely registered.** The felt world of this music was gentler than everyday emotion.
- **Mixed pieces drew the widest range of reactions.** Clear music got a clear response; ambiguous music leaves room for the listener.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_built }}</summary>

- **Two layers.** Where each feeling sits comes from word ratings (Warriner, Kuperman and Brysbaert 2013) on Russell's circumplex (1980). How a point sounds follows Eerola, Friberg and Bresin (2013), and each feeling's character follows the Geneva Emotional Music Scale, Hevner's clusters and the reviews by Juslin and Laukka. The study checks the labels on real recordings.
- **What is our choice.** The size of each step (tempo, semitones, decibels), which instrument plays which feeling, "not" crossing to the other side of the centre and flattening, a blend landing halfway between two feelings, and how far "very" and "a bit" move a point. That intensity is the distance from the centre does follow Russell's reading.
- **What the study changed.** Sadness, longing, nostalgia, being moved and bittersweet play in free rhythm with a swell in loudness; joy and play keep a steady beat and steady loudness. In our own rough measurement of the recordings, loudness moved by about 8 to 14 dB in the happy pieces and by 19 to 48 dB in the sad ones. Bittersweet turns the third from major to minor, as the study's mixed pieces did.
- **Real instruments.** The notes are single-note recordings from VSCO 2 Community Edition (Versilian Studios, released as CC0), in the web edition by N. P. Brosowsky (tonejs-instruments, CC BY 3.0). Which instrument plays which feeling is our choice, not a finding. The one research link is brightness: in Eerola, Friberg and Bresin (2013) brighter sounds went with higher arousal, so the page brightens or darkens the sound with it.
- **It is not a test of the sound.** The study's pieces were real performances; this page assembles recorded notes by rules. The page does not play Persian classical modes.
- **The study is the site author's own master's research** (unpublished).

</details>

{% include placement.html %}

<details class="fold" markdown="1">
<summary>{{ t.detail_limits }}</summary>

Twenty students from one city, aged 20 to 30, in a lab, with pieces the researcher chose. Treat the happy and sad results as strong and the rest as early signs. Mood in the week before showed no link to how strongly people heard or felt emotion, but the sample was too small to rule that out.

</details>
