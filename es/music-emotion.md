---
layout: project
title: Escucha un sentimiento
description: "Escribe una palabra de un sentimiento en inglés, español o persa, o toca un mapa de sentimientos, y escúchalo como una frase breve de música tocada con instrumentos grabados."
lede: "Escribe una palabra de un sentimiento, o toca el mapa, y escúchalo como una frase breve de música."
decision: "Un sentimiento es un lugar, no una etiqueta. Todos los sentimientos están en un mismo mapa, así que los que están cerca suenan parecido, y palabras como «muy», «un poco» y «no» simplemente mueven el punto."
permalink: /es/projects/music-emotion/
ref: music-emotion
cta_label: Pruébalo
cta_url: /es/#taf-title
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **Una entrada y un mapa.** Escribe un sentimiento en inglés, español o persa, o toca o arrastra sobre el mapa: cada punto suena distinto. Al pasar el cursor se ve cómo sería un punto antes de que suene.
- **Cámbialo escribiendo.** «muy triste» desplaza el punto hacia fuera, «un poco triste» hacia dentro, «no feliz» al otro lado y «triste y esperanzado» cae entre los dos.
- **Tocada con instrumentos reales.** Piano, cuerdas, flauta y otros, grabados nota a nota. La misma palabra da siempre la misma frase.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_why }}</summary>

- **Dónde está cada sentimiento.** Miles de palabras inglesas han sido puntuadas por la gente según lo agradables que resultan y lo tranquilas o intensas que son. Cada sentimiento está en el mapa donde se puntuó su palabra: más agradable hacia la derecha, más intenso hacia arriba.
- **Cómo suena.** Décadas de investigación musical coinciden en unas pocas señales. La música triste suele ser lenta, grave y en modo menor; la alegre, más rápida, más brillante y en modo mayor; la tranquila tiene pocas notas y suaves. Al moverte por el mapa, la página sube y baja esas señales.
- **Lo que hemos elegido nosotros.** Qué instrumento toca cada sentimiento, cuánto mueven un punto «muy» y «un poco», y el tamaño exacto de cada paso son decisiones de diseño, no hallazgos.
- **Un boceto, no una prueba.** Está construido a partir de hallazgos publicados y no se ha probado con oyentes. La mayoría de esos hallazgos proceden de oyentes occidentales y de música occidental.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_credits }}</summary>

- **El mapa:** el modelo circumplejo de Russell (1980), con las puntuaciones de palabras de Warriner, Kuperman y Brysbaert (2013).
- **El sonido:** las revisiones sobre señales de Juslin y Laukka (2003) y de Gabrielsson y Lindström (2010), y Eerola, Friberg y Bresin (2013). Los sentimientos se apoyan en la Escala Ginebrina de Emociones Musicales (Zentner y colaboradores, 2008) y en los grupos de adjetivos de Hevner (1936). Las referencias completas están en «{{ t.feeling.research }}», en la página de inicio.
- **Los instrumentos:** grabaciones de notas sueltas de VSCO 2 Community Edition (Versilian Studios, publicadas como CC0), en la edición web de N. P. Brosowsky (tonejs-instruments, CC BY 3.0).

</details>
