---
title: Blog
nav:
  order: 5
  tooltip: Blog & Miscellany
---

# {% include icon.html icon="fa-solid fa-pen-nib" %} Insights & Stories

{% include search-box.html %}

{% if site.tags.size > 0 %}
  <div class="tags" data-link="{{ page.dir | absolute_url }}">
    {% for tag in site.tags %}
      {% assign tag_name = tag[0] | strip | replace: ',', '' %}
      <a href="{{ page.dir | absolute_url }}?search=&quot;tag: {{ tag[0] }}&quot;" class="tag">{{ tag_name }}</a>
    {% endfor %}
  </div>
{% endif %}

{% include search-info.html %}

{% include list.html data="posts" component="post-excerpt" %}
