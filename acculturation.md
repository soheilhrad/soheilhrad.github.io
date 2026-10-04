---
layout: project
title: Acculturation
description: A small town, simulated in NetLogo. Newcomers settle, ties form, and integration or separation emerges from host receptivity, individual preparedness and the capacity of local services.
lede: "A small town, simulated in NetLogo. Newcomers arrive, ties form, and the town shows when settlement leads to integration and when it leads to separation."
decision: "Outcomes are not assigned or scored. They are read from each person's network: who they are actually connected to, inside their own community and across to the host one."
permalink: /projects/acculturation/
redirect_from: /projects/small-town/
ref: acculturation
clip: /assets/video/acculturation-demo.mp4
poster: /assets/img/projects/acculturation-poster.jpg
image: /assets/img/projects/acculturation-poster.jpg
ask: true
related: [wall-of-paper]
clip_alt: "The Acculturation model running in NetLogo: agents settle on a town map while the charts show integration rising and separation falling over 500 ticks."
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **Newcomers settle among residents.** Every person is an agent who forms ties over time.
- **Outcomes are read from the network, not assigned.** Integration and separation are patterns of ties, inside a person's own community and across to the host one.
- **Three levers**: how receptive the town is, how prepared newcomers are, and how much capacity local services have.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_result }}</summary>

In the run above (500 ticks), integration climbs to about 95% of newcomers and separation falls to about 5%, while average stress falls. Other settings give other towns, which is the point of the model: it shows which of the three levers moves the outcome.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_built }}</summary>

- **Grounded in theory**: Berry's acculturation model, Bourhis's interactive model, contact theory and rejection–identification.
- **Adds two rare things**: acculturative stress with buffering, and service capacity that congests as demand grows.
- **Status**: a working model. We are preparing its documentation (an ODD protocol) and a sensitivity analysis.

</details>
