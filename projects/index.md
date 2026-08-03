---
title: Projects
nav:
  order: 3
  tooltip: Ongoing Projects & More
---

# {% include icon.html icon="fa-solid fa-laptop-code" %}Projects

## Recent Research Developments in our Group&nbsp;:seedling::seedling::seedling:

{% include search-box.html %}

<div class="tags" data-link="{{ page.dir | absolute_url }}">
  {% assign project_page_tags = "publication,resource,website" | split: ',' %}
  {% for tag in project_page_tags %}
    <a href="{{ page.dir | absolute_url }}?search=&quot;tag: {{ tag }}&quot;" class="tag">{{ tag }}</a>
  {% endfor %}
</div>

{% include search-info.html %}

## {% include icon.html icon="fa-solid fa-lightbulb" %}Featured

{% include list.html component="card" data="projects" filters="group: featured" %}

## {% include icon.html icon="fa-solid fa-infinity" %}More

{% include list.html component="card" data="projects" filters="group: " style="small" %}

## {% include icon.html icon="fa-solid fa-book-open-reader" %}A selection of published works

{% include list.html component="card" data="projects" filters="group: published" %}
