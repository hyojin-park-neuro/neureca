---
title: Blog
nav:
  order: 5
  tooltip: Blog & Miscellany
---

# {% include icon.html icon="fa-solid fa-pen-nib" %} Blog & Stories Unveiled!


{% include section.html %}

{% include search-box.html %}

{% include tags.html tags=site.tags %}

{% include search-info.html %}

## Highlighted

{% include list.html lookup="Competition Funded PhD Project" style="rich" %}

{% include section.html %}

{% include list.html data="posts" component="post-excerpt" %}
