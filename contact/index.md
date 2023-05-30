---
title: Contact
nav:
  order: 7
  tooltip: Email, Address & Location
carousels:
  - images: 
    - image: /images/carousel/uob_1.jpg
      caption: "Old Joe & Library"
    - image: /images/carousel/uob_2.jpg
      caption: "Aston Webb"
    - image: /images/carousel/uob_3.jpg
      caption: "Nighttime View of Old Joe"
    - image: /images/carousel/uob_4.jpg
      caption: "Chancellor's Court"
    - image: /images/carousel/uob_5.jpg
      caption: "Autumnal View of Old Joe"
    - image: /images/carousel/uob_6.jpg
      caption: "Panoramic View of UoB"
---

# {% include icon.html icon="fa-solid fa-envelope-open-text" %}Contact

{%
  include button.html
  type="email"
  text="h.park@bham.ac.uk"
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

{% capture content %}
{% include figure.html image="images/chbh_1.png" %}
{% include figure.html image="images/chbh_2.png" %}
{% include figure.html image="images/chbh_3.png" %}
{% include figure.html image="images/chbh_4.png" %}
{% include figure.html image="images/chbh_5.png" %}
{% include figure.html image="images/chbh_6.jpg" %}
{% endcapture %}
{% include grid.html style="square" content=content %}

{% include section.html %}

<a href="https://twitter.com/HyojinParkNeuro?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @HyojinParkNeuro</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<a class="twitter-timeline" data-width="100%" data-height="1000%" href="https://twitter.com/HyojinParkNeuro?ref_src=twsrc%5Etfw">Tweets by HyojinParkNeuro</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

{% include section.html %}

{% capture col1 %}
### {% include icon.html icon="fa-solid fa-address-card" %}***Postal Address***
> School of Psychology <br>
> Centre for Human Brain Health (CHBH) <br>
> University of Birmingham <br>
> Edgbaston <br>
> Birmingham, UK <br>
> B15 2TT
{% endcapture %}

{% capture col2 %}
### {% include icon.html icon="fa-solid fa-location-dot" %}***Visiting Address***
> Office 102 <br>
> Centre for Human Brain Health (CHBH) <br>
> University of Birmingham <br>
> Edgbaston <br>
> Birmingham, UK <br>
> B15 2TT
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
  duration="6"
  number="1"
%}


{%
  include figure.html
  image="images/logo_uob_3.png"
%}

