---
layout: project
title: Acculturation
description: "A small town, simulated on a computer. Newcomers arrive and make connections, and the town shows when they become part of it and when they stay apart."
lede: "Why do some newcomers become part of a town while others stay apart? This simulated small town lets you watch it happen."
decision: "Nobody in the model is labelled in advance. Whether a newcomer becomes part of the town or stays apart is read from the connections they actually end up with."
permalink: /projects/acculturation/
redirect_from: /projects/small-town/
ref: acculturation
clip: /assets/video/acculturation-demo.mp4
poster: /assets/img/projects/acculturation-poster.jpg
image: /assets/img/projects/acculturation-poster.jpg
ask: true
related: [wall-of-paper]
clip_alt: "The Acculturation simulation running: people settle on a town map while the charts show integration rising and separation falling over the run."
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **A town of individuals.** Every resident and every newcomer is simulated as a person who meets others and builds connections over time.
- **Two ways a newcomer's story can go.** Integration: connections both inside their own community and with local residents. Separation: connections almost only inside their own community.
- **Three things you can change.** How welcoming the town is, how prepared newcomers are when they arrive, and how much local services can handle before they are overloaded.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_result }}</summary>

In the run in the clip, integration climbs until about 95 in every 100 newcomers have connections on both sides, about 5 in 100 stay apart, and the average strain newcomers are under goes down. Change the three settings and you get a different town. That is what the model is for: seeing which of the three makes the difference.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_built }}</summary>

- **Built in NetLogo**, a tool for simulating many individuals at once and watching what patterns emerge from them.
- **Moving is stressful, and the model counts that.** Connections soften the strain, and local services help less once more people need them than they can serve.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_research }}</summary>

An agent-based model grounded in Berry's acculturation model, Bourhis's interactive acculturation model, contact theory and the rejection–identification model. It adds acculturative stress with buffering, and service capacity that congests as demand grows.

</details>
