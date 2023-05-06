---
title: Contact
nav:
  order: 5
  tooltip: Email, address, and location
---

# {% include icon.html icon="fa-regular fa-envelope" %}Contact

{%
  include button.html
  type="email"
  text="Hyojin Park"
  link="h.park@bham.ac.uk"
%}
{%
  include button.html
  type="phone"
  text="UK (0121) 414-2948"
  link="+44-0121-414-2948"
%}
{%
  include button.html
  type="address"
  text="Location"
  tooltip="Our location on Google Maps for easy navigation"
  link="https://goo.gl/maps/6WUCN6RKZxGCqbXU7"
%}
{%
  include button.html
  type="address"
  text="Campus Map"
  tooltip="Interactive Campus Map"
  link="https://campusmap.bham.ac.uk//search/projects/23/5d6f49301e1f64009327b7cd"
%}
{% include section.html %}

{% capture col1 %}

{%
  include figure.html
  image="images/chbh.jpg"
  caption="Centre for Human Brain Health (CHBH), University of Birmingham"
%}

{% endcapture %}

{% capture col2 %}

{%
  include figure.html
  image="images/chbh.jpg"
  caption="Centre for Human Brain Health (CHBH)"
%}

{% endcapture %}

{% include cols.html col1=col1 %}

{% include section.html background.color="#70848C" %}

{% capture col1 %}
***Postal Address*** <br>
School of Psychology <br>
Centre for Human Brain Health (CHBH) <br>
University of Birmingham <br>
Edgbaston <br>
Birmingham, UK <br>
B15 2TT
{% endcapture %}

{% capture col2 %}
***Visiting Address*** <br>
Office 102 <br>
Centre for Human Brain Health (CHBH) <br>
University of Birmingham <br>
Edgbaston <br>
Birmingham, UK <br>
B15 2TT
{% endcapture %}

{% capture col3 %}
Lorem ipsum dolor sit amet  
consectetur adipiscing elit  
sed do eiusmod tempor
{% endcapture %}

{% include cols.html col1=col1 col2=col2 %}
