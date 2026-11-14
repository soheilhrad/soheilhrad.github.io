---
layout: post
title: "¿Las capacidades de la IA aparecen de verdad de repente?"
seo_title: "Capacidades emergentes de la IA: ¿salto real o espejismo?"
description: "Wei et al. (2022) describen capacidades que surgen de golpe al crecer los modelos; Schaeffer et al. (2023) las atribuyen a cómo se puntúan las pruebas."
ref: emergence
lang: es
permalink: /es/blog/2026/10/emergence/
image: /assets/img/posts/emergence/poster.jpg
related: [schelling-segregation, why-chatbots-sound-sure, dreamless-solitude]
last_modified_at: 2026-11-14
---

<video class="project-video" controls preload="metadata" playsinline poster="/assets/img/posts/emergence/poster.jpg">
  <source src="/assets/video/emergence-es.mp4" type="video/mp4">
</video>

## Capacidades emergentes: la definición de Wei et al. (2022)

Cuando los modelos de IA se hacen más grandes, algunas capacidades parecen surgir de la nada: un modelo más pequeño falla por completo una tarea y uno más grande, de repente, la resuelve. Los investigadores las llaman capacidades emergentes. Un artículo muy citado considera emergente una capacidad «si no está presente en los modelos más pequeños, pero sí en los más grandes» (Wei et al., 2022; cita traducida del inglés).

## El argumento del espejismo: puntuar aprobado o suspenso (Schaeffer et al., 2023)

No todo el mundo cree que esos saltos sean reales. Un estudio posterior sostiene que dependen de cómo se puntúan las pruebas (Schaeffer et al., 2023). Con una puntuación estricta de aprobado o suspenso, un modelo que se acerca poco a poco a la respuesta correcta sigue sacando cero hasta que acierta del todo, así que su progreso parece un salto repentino. Con una puntuación que premia acercarse, los mismos modelos mejoran de forma gradual y predecible.

La pregunta sigue abierta. El vídeo muestra la primera visión: piezas dispersas que, al pasar un punto de inflexión, se unen en algo que ninguna tenía por separado.

## Pruébalo: los mismos modelos, dos formas de puntuar

{% include scoring-toy.html %}

Prueba esto: la próxima vez que leas que una IA ha aprendido algo «de repente», pregunta cómo se midió.

## Fuentes (en inglés)

- Wei, J., et al. (2022). [Emergent Abilities of Large Language Models](https://arxiv.org/abs/2206.07682). *Transactions on Machine Learning Research*.
- Schaeffer, R., Miranda, B., & Koyejo, S. (2023). [Are Emergent Abilities of Large Language Models a Mirage?](https://arxiv.org/abs/2304.15004) arXiv:2304.15004.
