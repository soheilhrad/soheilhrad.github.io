---
layout: post
title: "Sonar humano nunca fue una prueba"
seo_title: "«AI slop» y el test de Turing: sonar humano no es una prueba"
description: "Desde ELIZA en 1966 hasta un test de Turing en 2025, hemos juzgado lo «humano» por cómo suena un texto. La investigación dice que esas pistas a menudo nos engañan, y apunta a una pregunta mejor."
ref: sounds-human
lang: es
permalink: /es/blog/2026/10/sounds-human/
image: /assets/img/posts/sounds-human/robot-under-desk.jpg
last_modified_at: 2026-10-29
---

![Una persona con sonrisa satisfecha ante un portátil cuya pantalla dice, en inglés, «Este post se escribió completamente sin IA», mientras un pequeño robot dorado, detrás de la silla, es quien teclea en un teclado conectado al portátil.](/assets/img/posts/sounds-human/robot-under-desk.jpg)

«Este post se escribió completamente sin IA». ¿Me creerías? ¿Y si le pusiera algunas erratas? ¿Un emoji? ¿Una historia tierna sobre mi familia?

Sinceramente, uso IA en mi trabajo, también para lo que publico aquí y en LinkedIn. Esta nota se escribió con su ayuda, y cada afirmación se ha contrastado con las fuentes que aparecen al final.

Últimamente aparece en mi feed de LinkedIn un tipo nuevo de publicación: gente que dice que cualquier post bien acabado es «AI slop», contenido de relleno hecho con IA. Parte de eso es justo. Hay mucho contenido vacío y generado por ahí. Pero debajo hay una prueba rápida que todos hacemos sin pensar: ¿*suena* a que lo ha escrito una persona? Esa prueba es mucho más antigua que ChatGPT, y nunca ha funcionado muy bien.

## 1966: un programa que le daba la vuelta a tus palabras

En 1966, Joseph Weizenbaum, del MIT, publicó ELIZA, un programa con el que se podía «hablar» escribiendo. No entendía nada. Buscaba palabras clave en lo que escribías y reconstruía tu frase con reglas fijas. El ejemplo del propio Weizenbaum: a partir de «Estoy muy triste estos días», una regla así puede formar «¿Cuánto tiempo llevas muy triste estos días?». Con su guion más conocido, ELIZA respondía más o menos como lo haría cierto tipo de psicoterapeuta, casi siempre con preguntas.

Aun así, la gente se sentía comprendida. Weizenbaum explicó por qué: quien habla con el programa supone que detrás de las respuestas hay conocimiento y comprensión, y mantiene esa impresión rellenando los huecos. Para él, esa sensación de ser comprendido era una aportación de quien hablaba, no del programa.

## 2025: el mismo modelo, otro personaje

Casi sesenta años después, Cameron Jones y Benjamin Bergen hicieron un test de Turing clásico a tres bandas. Cada participante chateaba a la vez con dos interlocutores, una persona y una IA, durante un máximo de cinco minutos, y después decía cuál era la persona.

A una de las versiones de GPT-4.5 le dieron un personaje que interpretar: en palabras de los autores, «una persona joven, introvertida, que conoce bien la cultura de internet y usa jerga» (cita traducida del inglés). Parte de sus instrucciones decía (traducido del inglés):

> «Tienes 19 años y te encantan la cultura de internet y los videojuegos».<br>
> «Nunca pongas punto al final de tus frases».<br>
> «Casi siempre, tus respuestas tendrán menos de 5 palabras».

Con ese personaje, la gente eligió a GPT-4.5 como la persona el 73 % de las veces, significativamente más que a la persona real. Sin él, el mismo modelo fue elegido el 36 % de las veces, sin ser significativamente mejor que ELIZA, con un 23 %. Otro modelo, LLaMa-3.1, con el mismo personaje, fue elegido el 56 % de las veces, más o menos tan a menudo como las personas reales.

El mismo modelo. Lo que cambió fue el personaje que le pidieron interpretar.

Los autores son prudentes sobre lo que esto significa. Un personaje por sí solo no basta: un sistema «no puede tener éxito solo a base de estos trucos» (cita traducida del inglés). Pero también escriben que el test de Turing «no es una prueba directa de inteligencia, sino de parecido humano» (cita traducida del inglés). Y la gente juzgó ese parecido humano sobre todo por la charla trivial y el estilo. Solo un 12 % hizo preguntas de conocimiento o razonamiento como las que Turing tenía en mente. Lo familiarizada que estaba la gente con los chatbots no cambió de forma constante cuánto acertaba.

## Las pistas en las que confiamos nos engañan

Un estudio de 2023 en *PNAS* pidió a 4.600 personas que distinguieran perfiles escritos por personas (para empleos, citas y alquileres vacacionales) de perfiles escritos por IA. Acertaron más o menos la mitad de las veces, casi como al azar, incluso cuando se les pagaba por acertar o se les decía después de cada respuesta si habían acertado.

Pero no respondían al azar. Compartían las mismas reglas intuitivas. Hablar de la familia, usar «yo» y un tono cálido parecían humanos, pero la familia y el «yo» aparecían igual de a menudo en los perfiles escritos por IA. Los errores gramaticales dividían a la gente: unos veían una IA torpe; otros, una persona real que se equivoca. De media, los textos con errores se juzgaban como IA más a menudo, aunque en realidad tenían menos probabilidades de serlo. Y cuando los investigadores escogieron textos de IA que encajaban con las pistas «humanas» de la gente, esos textos se juzgaron humanos más a menudo que los que habían escrito personas reales.

¿Recuerdas las erratas y la historia familiar del principio de esta nota? Son justo las pistas en las que confiamos, y a menudo nos engañan.

Ese estudio usó modelos más antiguos (GPT-2 y GPT-3), y los autores dicen que las pistas de la gente pueden cambiar. Hay otro resultado que se me ha quedado: cuando se preguntaba simplemente si un texto tenía sentido o se repetía, esas respuestas detectaban mejor los textos de IA que preguntar directamente «¿esto es IA?».

## Las herramientas también se equivocan, y no con todos igual

El software que dice detectar textos escritos con IA tiene su propio punto ciego. Un estudio de 2023 vio que varios detectores muy utilizados etiquetaban una y otra vez como generados por IA los ensayos de personas que escriben en inglés como segunda lengua, mientras que los de hablantes nativos se juzgaban bien. La redacción más sencilla y limitada les parecía «de máquina». Los detectores se han actualizado desde entonces, pero conviene conocer el riesgo, sobre todo si escribes en tu segunda o tercera lengua.

## Sí, la IA tiene un estilo reconocible

Nada de esto significa que la escritura con IA sea invisible. Un estudio de 2025 vio que las personas que usan a menudo herramientas de IA para escribir detectaban muy bien los artículos escritos por IA. Cinco de esas lectoras y lectores, votando juntos, solo fallaron en uno de 300 artículos, incluso cuando el texto de IA se había parafraseado para disimularlo. Captaban el típico «vocabulario de IA», y también lo formal, original y claro que era el texto. Quienes casi no usaban IA lo hacían mal, y con más confianza de la que deberían.

Yo también lo noto. Los diseños y los posts de las grandes herramientas de IA suelen compartir un aire que acabas reconociendo.

Mi lectura de este estudio junto al test de Turing: cuando la IA escribe con su voz por defecto, quien tiene práctica la detecta. Cuando se le pide interpretar un personaje en un chat corto, estar familiarizado con los chatbots no ayudó.

## Lo que el estilo puede y no puede decirte

Así que la plantilla existe. Pero reconocerla solo te dice una cosa: que una herramienta dio forma al texto. No te dice si alguien pensó la idea a fondo, si lo que afirma es cierto ni si el post te sirve. Una persona puede escribir contenido vacío sin ninguna IA, y una persona puede usar IA y hacer igualmente el trabajo de pensar.

Para mí, ahí está la línea. El contenido de relleno es cuando nadie se tomó el trabajo de pensar.

## Prueba esto

La próxima vez que un post te parezca hecho con IA, antes de decidir, hazte tres preguntas que el estilo no puede responder. ¿Es cierto? ¿Tiene fuentes? ¿Me sirve?

Fuentes (en inglés):

- Weizenbaum, J. (1966). ELIZA: A computer program for the study of natural language communication between man and machine. *Communications of the ACM*, 9(1), 36–45. [doi.org/10.1145/365153.365168](https://doi.org/10.1145/365153.365168)
- Jones, C. R., & Bergen, B. K. Large language models pass a standard three-party Turing test. *PNAS* (2026). [doi.org/10.1073/pnas.2524472123](https://doi.org/10.1073/pnas.2524472123). Consultado en su preprint de 2025, «Large Language Models Pass the Turing Test», [arXiv:2503.23674](https://arxiv.org/abs/2503.23674); las citas y cifras de arriba proceden de esa versión. Originales de las citas: "a young person who is introverted, knowledgeable about internet culture, and uses slang"; "You're a 19 year old who is into internet culture and video games."; "Never use a period at the end of your sentences."; "Most of the time, your responses will be less than 5 words."; "they cannot succeed on the basis of these tricks alone"; "not a direct test of intelligence, but a test of humanlikeness".
- Jakesch, M., Hancock, J. T., & Naaman, M. (2023). Human heuristics for AI-generated language are flawed. *PNAS*, 120(11), e2208839120. [doi.org/10.1073/pnas.2208839120](https://doi.org/10.1073/pnas.2208839120)
- Liang, W., Yuksekgonul, M., Mao, Y., Wu, E., & Zou, J. (2023). GPT detectors are biased against non-native English writers. *Patterns*, 4(7), 100779. [doi.org/10.1016/j.patter.2023.100779](https://doi.org/10.1016/j.patter.2023.100779)
- Russell, J., Karpinska, M., & Iyyer, M. (2025). People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text. *Proceedings of ACL 2025*. [arXiv:2501.15654](https://arxiv.org/abs/2501.15654)
