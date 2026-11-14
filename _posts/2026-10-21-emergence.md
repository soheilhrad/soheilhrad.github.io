---
layout: post
title: "Do AI abilities really appear suddenly?"
seo_title: "Emergent abilities of LLMs: real jumps or a scoring mirage?"
description: "Wei et al. (2022) describe abilities that appear suddenly as language models grow; Schaeffer et al. (2023) argue the jumps come from pass-or-fail scoring."
ref: emergence
image: /assets/img/posts/emergence/poster.jpg
related: [schelling-segregation, why-chatbots-sound-sure, dreamless-solitude]
last_modified_at: 2026-11-14
---

<video class="project-video" controls preload="metadata" playsinline poster="/assets/img/posts/emergence/poster.jpg">
  <source src="/assets/video/emergence-en.mp4" type="video/mp4">
</video>

## Emergent abilities: the definition by Wei et al. (2022)

As AI models get bigger, some abilities seem to appear out of nowhere: a smaller model fails a task completely, and a larger one suddenly does it. Researchers call these emergent abilities. One well-known paper defines an ability as emergent "if it is not present in smaller models but is present in larger models" (Wei et al., 2022).

## The mirage argument: pass-or-fail scoring (Schaeffer et al., 2023)

Not everyone agrees the jumps are real. A later study argues that they come from how the tests are scored (Schaeffer et al., 2023). With a strict pass-or-fail score, a model that is slowly getting closer to the right answer still scores zero until it gets it fully right, so its progress looks like a sudden leap. With a score that gives credit for getting closer, the same models improve smoothly and predictably.

The question is still open. The film shows the first view: scattered pieces that, past a tipping point, link up into something none of them had alone.

## Try it: the same models, two ways of scoring

{% include scoring-toy.html %}

Try this: next time you read that an AI "suddenly" learned something, ask how it was measured.

## Sources

- Wei, J., et al. (2022). [Emergent Abilities of Large Language Models](https://arxiv.org/abs/2206.07682). *Transactions on Machine Learning Research*.
- Schaeffer, R., Miranda, B., & Koyejo, S. (2023). [Are Emergent Abilities of Large Language Models a Mirage?](https://arxiv.org/abs/2304.15004) arXiv:2304.15004.
