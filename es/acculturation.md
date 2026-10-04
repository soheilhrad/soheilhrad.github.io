---
layout: project
title: Acculturation
description: Un pueblo pequeño, simulado en NetLogo. Llegan recién llegados, se crean vínculos y la integración o la separación surgen de la receptividad de los vecinos, la preparación individual y la capacidad de los servicios locales.
lede: "Un pueblo pequeño, simulado en NetLogo. Llega gente nueva, se crean vínculos y el pueblo muestra cuándo el asentamiento lleva a la integración y cuándo a la separación."
decision: "Los resultados no se asignan ni se puntúan: se leen en la red de cada persona, es decir, con quién está realmente conectada, dentro de su propia comunidad y con la comunidad de acogida."
permalink: /es/projects/acculturation/
redirect_from: /es/projects/small-town/
ref: acculturation
clip: /assets/video/acculturation-demo.mp4
poster: /assets/img/projects/acculturation-poster.jpg
image: /assets/img/projects/acculturation-poster.jpg
ask: true
related: [wall-of-paper]
clip_alt: "El modelo Acculturation en NetLogo: los agentes se asientan en el mapa de un pueblo mientras los gráficos muestran cómo sube la integración y baja la separación a lo largo de 500 ticks."
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **Los recién llegados se asientan entre los vecinos.** Cada persona es un agente que crea vínculos con el tiempo.
- **Los resultados se leen en la red, no se asignan.** Integración y separación son patrones de vínculos, dentro de la propia comunidad y con la comunidad de acogida.
- **Tres palancas**: lo receptivo que es el pueblo, lo preparados que llegan y cuánta capacidad tienen los servicios locales.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_result }}</summary>

En la simulación de arriba (500 ticks), la integración sube hasta cerca del 95 % de los recién llegados y la separación baja hasta cerca del 5 %, mientras el estrés medio disminuye. Otros ajustes dan otros pueblos, y ese es el sentido del modelo: muestra cuál de las tres palancas mueve el resultado.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_built }}</summary>

- **Basado en teoría**: el modelo de aculturación de Berry, el modelo interactivo de Bourhis, la teoría del contacto y el rechazo-identificación.
- **Añade dos cosas raras**: estrés aculturativo con amortiguación y servicios que se saturan al crecer la demanda.
- **Estado**: un modelo en funcionamiento. Estamos preparando su documentación (un protocolo ODD) y un análisis de sensibilidad.

</details>
