---
layout: project
title: Escucha un sentimiento
description: "Escribe una palabra de un sentimiento en inglés, español o persa y escucha una frase breve de música. Las etiquetas se contrastan con cómo valoraron los oyentes la música clásica persa."
lede: "Escribe una palabra de un sentimiento y escucha una frase construida con las señales que la investigación asocia a él. Se contrasta con un estudio de escucha de música clásica persa."
decision: "Oír una emoción y sentirla no es lo mismo, así que la página las mantiene separadas: lo que dice la música y lo que sientes tú."
permalink: /es/projects/music-emotion/
ref: music-emotion
cta_label: Pruébalo
cta_url: /es/#taf-title
---
{%- assign t = site.data.i18n[page.lang] -%}

<details class="fold" markdown="1" open>
<summary>{{ t.detail_does }}</summary>

- **Una sola entrada.** Escribe un sentimiento en inglés, español o persa, o toca el mapa. Suena una frase breve.
- **Hecha con señales, tocada con instrumentos reales.** El modo, el tempo, el registro, el brillo, el ritmo y el volumen forman la música, y la tocan piano, cuerdas, flauta y otros instrumentos grabados. La misma palabra da siempre la misma frase.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_result }}</summary>

En un estudio de escucha, 20 personas sin formación musical profesional oyeron nueve piezas de música clásica persa: tres elegidas como alegres, tres como tristes y tres como las dos cosas a la vez, además de seis sonidos de relleno (lluvia, viento, mar y similares). Tras cada pieza valoraron, de 1 a 5, lo que expresaba la música y lo que sentían.

| Tipo de pieza | Oída como alegre | Oída como triste |
|---|---|---|
| Alegre | 4,1 | 1,4 |
| Triste | 1,3 | 4,0 |
| Mixta | 2,9 | 2,0 |

- **Oír y sentir fueron de la mano.** Oír alegría iba con sentirse alegre (0,86) y con energía (0,82); oír tristeza, con sentirse triste (0,81). Lo que se sentía solía igualar a lo que se oía o quedarse por debajo.
- **La música más triste fue la que más conmovió** (0,34), y el asombro, la nostalgia y sentirse conmovido formaron una familia propia, poco ligada a lo alegre o lo triste.
- **La ira, el miedo y la ansiedad casi no aparecieron.** El mundo de lo sentido en esta música era más suave que el de la vida diaria.
- **Las piezas mixtas provocaron las reacciones más variadas.** La música clara obtuvo una respuesta clara; la ambigua deja espacio al oyente.

</details>

<details class="fold" markdown="1">
<summary>{{ t.detail_built }}</summary>

- **Dos capas.** La página suena a partir de señales publicadas (el mapa de Russell, la Escala Ginebrina de Emociones Musicales, los grupos de Hevner, las revisiones de Juslin y Laukka). El estudio contrasta las etiquetas con grabaciones reales.
- **Lo que cambió el estudio.** Tristeza, añoranza, nostalgia, conmovido y agridulce suenan en ritmo libre, con una subida y bajada de volumen; alegría y juego mantienen un pulso y un volumen estables. En nuestra medición aproximada de las grabaciones, el volumen se movía entre 8 y 14 dB en las piezas alegres y entre 19 y 48 dB en las tristes. «Agridulce» cambia la tercera de mayor a menor, como las piezas mixtas del estudio.
- **Instrumentos reales.** Las notas son grabaciones de notas sueltas de VSCO 2 Community Edition (Versilian Studios, publicada como CC0), en la edición web de N. P. Brosowsky (tonejs-instruments, CC BY 3.0). Qué instrumento toca cada sentimiento es decisión nuestra, no un hallazgo. El único vínculo con la investigación es el brillo: en Eerola, Friberg y Bresin (2013) los sonidos más brillantes iban con más activación, así que la página aviva o apaga el sonido según ella.
- **No es una prueba del sonido.** Las piezas del estudio eran interpretaciones reales; esta página ensambla notas grabadas con reglas. La página no toca modos de la música clásica persa.
- **El estudio es la investigación de máster de quien firma la página** (sin publicar).

</details>

{% include placement.html %}

<details class="fold" markdown="1">
<summary>{{ t.detail_limits }}</summary>

Veinte estudiantes de una misma ciudad, de 20 a 30 años, en un laboratorio y con piezas elegidas por el investigador. Toma los resultados de lo alegre y lo triste como sólidos y el resto como primeros indicios. El estado de ánimo de la semana anterior no mostró relación con la intensidad con que se oía o se sentía la emoción, pero la muestra era demasiado pequeña para descartarla.

</details>
