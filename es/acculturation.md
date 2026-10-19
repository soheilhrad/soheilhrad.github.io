---
layout: project
title: Acculturation
description: "Un pueblo pequeño, simulado por ordenador. Llegan recién llegados, crean vínculos, y el pueblo muestra cuándo pasan a formar parte de él y cuándo se quedan aparte."
lede: "¿Por qué algunos recién llegados pasan a formar parte de un pueblo y otros se quedan aparte? Este pueblo simulado te deja verlo."
decision: "En el modelo nadie lleva una etiqueta de antemano. Que un recién llegado forme parte del pueblo o se quede aparte se lee en los vínculos que acaba teniendo de verdad."
permalink: /es/projects/acculturation/
redirect_from: /es/projects/small-town/
ref: acculturation
clip: /assets/video/acculturation-demo.mp4
poster: /assets/img/projects/acculturation-poster.jpg
image: /assets/img/projects/acculturation-poster.jpg
ask: true
related: [wall-of-paper]
clip_alt: "La simulación Acculturation en marcha: la gente se asienta en el mapa de un pueblo mientras los gráficos muestran cómo sube la integración y baja la separación."
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **Un pueblo de personas.** Cada vecino y cada recién llegado se simula como una persona que conoce a otras y crea vínculos con el tiempo.
- **Dos caminos posibles para un recién llegado.** Integración: vínculos dentro de su propia comunidad y también con los vecinos del pueblo. Separación: vínculos casi solo dentro de su propia comunidad.
- **Tres cosas que puedes cambiar.** Lo acogedor que es el pueblo, lo preparados que llegan los recién llegados y cuánto aguantan los servicios locales antes de saturarse.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_result }}</summary>

En la simulación del vídeo, la integración sube hasta que unos 95 de cada 100 recién llegados tienen vínculos a ambos lados, unos 5 de cada 100 se quedan aparte, y la tensión media que soportan los recién llegados baja. Si cambias los tres ajustes, obtienes otro pueblo. Para eso sirve el modelo: para ver cuál de los tres marca la diferencia.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_built }}</summary>

- **Hecho en NetLogo**, una herramienta para simular a muchas personas a la vez y ver qué patrones surgen de ellas.
- **Mudarse genera estrés, y el modelo lo tiene en cuenta.** Los vínculos suavizan la tensión, y los servicios locales ayudan menos cuando los necesita más gente de la que pueden atender.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_research }}</summary>

Un modelo basado en agentes que se apoya en el modelo de aculturación de Berry, el modelo interactivo de aculturación de Bourhis, la teoría del contacto y el modelo de rechazo-identificación. Añade estrés aculturativo con amortiguación y una capacidad de los servicios que se satura al crecer la demanda.

</details>
