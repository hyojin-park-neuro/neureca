---
title: Home
nav:
  order: 1
  tooltip: Home
carousels:
  - images: 
    - image: /images/carousel/main_comms_1.svg
      caption: "The NEURECA Group"
    - image: /images/carousel/main_comms_2.svg
      caption: "Unraveling the Mysteries of the Brain"
    - image: /images/carousel/main_comms_3.svg
      caption: "By Delving into Real-world & Multi-modal Human Communication"
    - image: /images/carousel/main_comms_4.svg
      caption: "Using State-of-the-art Techniques & Analysis Approaches"
    - image: /images/carousel/main_comms_5.svg
      caption: "For People of All Ages"
---

<h2 style="text-align:center;color: #000000;font-size:25px;">Welcome to Dr. Hyojin Park's Research Group - <span style="font-family:'Alice';font-size:25px;font-weight:bold">NEURECA</span></h2>
<p style="text-align:center;color: #000000;font-size:30px;font-weight:bold;">Neural Representations & Computational Architecture of<br>Multi-modal Communication across Lifespan</p>

1. Our mission is to conduct rigorous research and push the boundaries of what is currently known, with the ultimate goal of improving human communication and enhancing quality of life.

2. Through cutting-edge research and collaboration, our group aims to advance our understanding of how the brain processes and responds to audiovisual communication. Our mission is to use this knowledge to inform new technologies, therapies, and interventions that benefit society as a whole.

3. We are committed to producing high-quality research that has real-world applications and benefits for people of all ages.

{% include section.html size="full" dark="hp_bgwhite" %}
{% include carousel_main.html
height="40"
unit="%"
duration="6"
number="1" 
%}

{% include section.html %}

**The main goal of our research group** is to understand neural oscillatory mechanisms in speech processing - both auditory and visual - as well as their integration that leads to a unified perception. 

**Why Rhythms in Speech?** Speech consists of a hierarchy of components occurring on different timescales. For example, prosody or intonation occurs on a relatively long timescale-hundreds of milliseconds, syllables occur on around hundred milliseconds, and short transients and phonemes last only tens of milliseconds. Similarly, distinct neuronal populations fire rhythmically at different rates (brain oscillations), and different bands of oscillations are arranged in a hierarchy.

**Speech Tracking (Speech-Brain Coupling)** These brain rhythms, low-frequency oscillations, in particular, are thought to establish efficient channels for communication. It's similar to tuning a radio to a certain frequency to listen to a certain radio station. We investigate how brain oscillatory activity and their multiplexed relationship track incoming speech inputs and further proactively predict upcoming speech streams for facilitating comprehension. In the course of time, we will investigate neural oscillatory mechanisms of speech production and interpersonal communication (brain-to-brain coupling).

**Rhythmic Stimulation using Rapid Invisible Frequency Tagging (RIFT) and Transcranial Stimulation** Can low-frequency rhythms (delta, theta bands) causally modulate audiovisual speech integration in effortful listening conditions? We are looking into how the rhythmic modulation enhances cortical excitability in the sensory cortex using sensory stimulation (Rapid Frequency Tagging) and transcranial stimulation (Ultrasound Stimulation) techniques. 

**Computational Models by harnessing NLP (Natural Language Processing) algorithms based on Large Language Models (LLMs)** Topic model, word vectors, and transformer models are used to study specific feature processing in the brain during naturalistic speech perception.

**Facilities and Tools** The Group is a part of the newly established Centre for Human Brain Health (CHBH) at the University of Birmingham. The Centre is equipped with state-of-the-art brain imaging facilities, e.g. MEG, OPM-MEG, EEG, MRI, TMS, TCS, Sleep labs, fNIRS. We combine these modalities in order to obtain a comprehensive picture of neural mechanisms of speech and multisensory (AV) integration.

{% include section.html dark="hp_bggray_icon1" %}

{% capture col1 %}
## {% include icon.html icon="fa-solid fa-brain" %}Research Topics
- AudioVisual Perception
- Auditory and Visual (Speech) Tracking
- Audio-Visual (Speech) Integration
- Speech Production
- Interpersonal Communication (Brain-to-Brain Coupling)
- Sensory-Motor Interaction
- (Age-related) Hearing Loss
- Deafness
- Brain Reorganisation following Sensory Loss
- Cross-modal Plasticity
- Brain-Body-Environment Coupling
- Modulation of Brain Activity using Rhythmic Stimulation
- [Mild Traumatic Brain Injury (mTBI)](https://www.birmingham.ac.uk/research/metabolism-systems/translational-brain-science/mtbi-predict){:target="_blank"}
- <div style="text-align: left">(Micro-)Saccadic Eye Movements and Audiovisual Attention</div>
- <div style="text-align: left">Audiovisual Speech/Language Development & Neural Plasticity across Lifespan</div>
- <div style="text-align: left">Disorganised thoughts and (internal) speech processing in psychosis</div>
- Cognitive Strategy Development
- Cross-modal Correspondence
- Synesthesia
- Music and Art Perception
{% endcapture %}

{% capture col2 %}
## {% include icon.html icon="fa-solid fa-screwdriver-wrench" %}Techniques & Approaches
- [SQUID-MEG (Magnetoencephalography)](https://www.birmingham.ac.uk/research/centres-institutes/human-brain-health/faciities/magnetoencephalography){:target="_blank"}
- [OPM-MEG (Optically-Pumped Magnetometers)](https://www.birmingham.ac.uk/research/centres-institutes/human-brain-health/faciities/optically-pumped-magnetometers){:target="_blank"}
- Electroencephalography (EEG)
- [Functional Near-Infrared Spectroscopy (fNIRS)](https://www.birmingham.ac.uk/research/centre-for-human-brain-health/chbh-research-facilities/fnirs){:target="_blank"}
- Diffusion Tensor Imaging (DTI)
- <div style="text-align: left">Focused Ultrasound Stimulation (FUS)</div>
- Transcranial Magnetic Stimulation (TMS)
- <div style="text-align: left">Sensory Stimulation, e.g., Rapid Invisible Frequency Tagging (RIFT)</div>
- Brain Network Analysis
- <div style="text-align: left">Information Theory Approach: Mutual Information (MI), Transfer Entropy (TE), Partial Information Decomposition (PID)</div>
- <div style="text-align: left">Computational Neural Architecture using Machine Learning & Deep Learning Algorithms</div>
- Encoding & Decoding
- Natural Language Processing (NLP)
- Large Language Models (LLMs)
{% endcapture %}

{% include cols.html col1=col1 col2=col2 %}

{% include section.html dark="hp_bgwhite_icon1" %}

## {% include icon.html icon="fa-brands fa-sketch" %}A Dynamic Impression: Sketching the Essence of Our Group

{% capture text %}

To unravel the enigmatic workings of the brain, our team employs **state-of-the-art neuroimaging facilities** and **cutting-edge analysis techniques**.

{%
  include button.html
  link="research"
  text="See our Publications"
  icon="fa-solid fa-arrow-right"
  flip=true
  style="bare"
%}

{% endcapture %}

{%
  include feature.html
  image="images/main_research.jpg"
  link="research"
  title="Our Research"
  text=text
%}

{% capture text %}

Our team is dedicated to advancing our understanding of the brain by **formulating seamless questions** and **making continuous progress** in our research.

{%
  include button.html
  link="projects"
  text="Browse our Projects"
  icon="fa-solid fa-arrow-right"
  flip=true
  style="bare"
%}

{% endcapture %}

{%
  include feature.html
  image="images/main_projects.png"
  link="projects"
  title="Our Projects"
  flip=true
  style="bare"
  text=text
%}

{% capture text %}

**Power of Synergies!** Teamwork is essential for unlocking the power of synergies, allowing individuals to leverage their strengths and achieve greater success than they could on their own.

{%
  include button.html
  link="team"
  text="Meet our Team"
  icon="fa-solid fa-arrow-right"
  flip=true
  style="bare"
%}

{% endcapture %}

{%
  include feature.html
  image="images/carousel/hyojin_park_2.jpg"
  link="team"
  title="Our Team"
  flip=false
  style="bare"
  text=text
%}
