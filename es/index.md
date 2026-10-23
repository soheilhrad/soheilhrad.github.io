---
layout: default
title: "dos — Design of سهی"
seo_title: "Apps de IA multilingües, simulaciones y herramientas de audio"
description: "Herramientas pequeñas para gente entre idiomas. Aplicaciones, simulaciones y herramientas en English, Español y فارسی, diseñadas y construidas de principio a fin. Encargos bienvenidos."
ref: home
permalink: /es/
last_modified_at: 2026-10-21
---
{%- assign t = site.data.i18n[page.lang] -%}
<section class="intro">
  <h1>Herramientas pequeñas para gente entre idiomas.</h1>
  <p class="lede">Aplicaciones, simulaciones y herramientas en <span lang="en" dir="ltr">English</span>, <span lang="es" dir="ltr">Español</span> y <span lang="fa" dir="rtl">فارسی</span>, diseñadas y construidas de principio a fin. Encargos bienvenidos.</p>
</section>

{% include type-a-feeling.html %}

<h2 class="works-heading">{{ t.projects }}</h2>
{% include project-list.html %}

{% include note-cards.html limit=2 %}

{%- if site.email and site.email != "" %}
<p class="contact"><a href="mailto:{{ site.email }}">{{ t.write_to_us }}</a></p>
{%- endif %}
