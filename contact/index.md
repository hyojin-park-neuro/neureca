---
title: Contact
nav:
  order: 7
  tooltip: Email, Address & Location
carousels:
  - images: 
    - image: /images/carousel/uob_1.jpg
    - image: /images/carousel/uob_2.jpg
    - image: /images/carousel/uob_3.jpg
    - image: /images/carousel/uob_4.jpg
    - image: /images/carousel/uob_5.jpg
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
  image="images/chbh_office.jpg"
  caption="Centre for Human Brain Health (CHBH), University of Birmingham"
%}

{% endcapture %}

{% capture col2 %}

{%
  include figure.html
  image="images/chbh_office.jpg"
  caption="Centre for Human Brain Health (CHBH)"
%}

{% endcapture %}

{% include cols.html col1=col1 %}

<a href="https://twitter.com/HyojinParkNeuro?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @HyojinParkNeuro</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<a class="twitter-timeline" data-width="100%" data-height="600%" href="https://twitter.com/HyojinParkNeuro?ref_src=twsrc%5Etfw">Tweets by HyojinParkNeuro</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

{% include section.html dark=false %}

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

{% include section.html %}

{%
  include carousel.html
  width="60"
  height="60"
  unit="%"
  duration="5"
  number="1"
%}