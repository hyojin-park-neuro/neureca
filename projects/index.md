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

## Some of published work

{% capture content %}
{% include figure.html image="images/chbh_1.png" caption="More than Words" link="https://hyojin-park-neuro.github.io/intro-published/2022-more-than-words" width="300px" %}
{% include figure.html image="images/paper-av-pid.png" caption="AV Integration" link="https://hyojin-park-neuro.github.io/intro-published/2018-av-pid" width="300px" %}
{% include figure.html image="images/paper-lip-tracking.png" caption="Lip Tracking" link="https://hyojin-park-neuro.github.io/intro-published/2016-lip-tracking" width="300px" %}
{% include figure.html image="images/chbh_4.png" caption="Frontal Top-down" link="https://hyojin-park-neuro.github.io/intro-published/2015-top-down" width="300px" %}
{% endcapture %}
{% include grid.html style="square" content=content %}
