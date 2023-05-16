---
title: Projects
nav:
  order: 3
  tooltip: Ongoing projects and more
---

# {% include icon.html icon="fa-solid fa-laptop-code" %}Projects

## Recent research developments in our Group &nbsp;:seedling::seedling::seedling:

{% include search-box.html %}

{% include tags.html tags="publication, resource, website" %}

{% include search-info.html %}

{% include section.html %}

## Featured

{% include list.html component="card" data="projects" filters="group: featured" %}

{% include section.html %}

## More

{% include list.html component="card" data="projects" filters="group: " style="small" %}


{% include section.html %}

{% capture content %}
{% include figure.html image="images/chbh_1.png" caption="The team at our annual Christmas party, 2025" link="https://hyojin-park-neuro.github.io/intro-published/2022-more-than-words" %}
{% include figure.html image="images/chbh_2.png" caption="The team at our annual Christmas party, 2025" link="team" %}
{% include figure.html image="images/chbh_3.png" caption="The team at our annual Christmas party, 2025" link="team" %}
{% include figure.html image="images/chbh_4.png" caption="The team at our annual Christmas party, 2025" link="team" %}
{% endcapture %}
{% include grid.html style="square" content=content %}
