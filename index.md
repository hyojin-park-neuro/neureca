---
---

## Welcome to Dr. Hyojin Park's Research Group!
### "Neural Representations & Computational Architecture of Multi-modal Brain across Lifespan"
{% include section.html dark=true %}
1. Our mission is to conduct rigorous research and push the boundaries of what is currently known, with the ultimate goal of improving human communication and enhancing quality of life.

2. Through cutting-edge research and collaboration, our group aims to advance our understanding of how the brain processes and responds to audiovisual communication. Our mission is to use this knowledge to inform new technologies, therapies, and interventions that benefit society as a whole.

3. We are committed to producing high-quality research that has real-world applications and benefits for people of all ages.

{% include section.html %}

**The main goal of our research group** is to understand neural oscillatory mechanisms in speech processing - both auditory and visual - as well as their integration that leads to a unified perception. 

**Why Rhythms in Speech?** Speech consists of a hierarchy of components occurring on different timescales. For example, prosody or intonation occurs on a relatively long timescale-hundreds of milliseconds, syllables occur on around hundred milliseconds, and short transients and phonemes last only tens of milliseconds. Similarly, distinct neuronal populations fire rhythmically at different rates (brain oscillations), and different bands of oscillations are arranged in a hierarchy.

**Speech Tracking (Speech-Brain Coupling)** These brain rhythms, low-frequency oscillations, in particular, are thought to establish efficient channels for communication. It's similar to tuning a radio to a certain frequency to listen to a certain radio station. We investigate how brain oscillatory activity and their multiplexed relationship track incoming speech inputs and further proactively predict upcoming speech streams for facilitating comprehension. In the course of time, we will investigate neural oscillatory mechanisms of speech production and interpersonal communication (brain-to-brain coupling).

**Rhythmic Stimulation using Rapid Frequency Tagging (RFT) and Transcranial Stimulation** Can low-frequency rhythms (delta, theta bands) causally modulate audiovisual speech integration in effortful listening conditions? We are looking into how the rhythmic modulation enhances cortical excitability in the sensory cortex using sensory stimulation (Rapid Frequency Tagging) and transcranial stimulation (Ultrasound Stimulation) techniques. 

**Computational Models by harnessing NLP (Natural Language Processing) Techniques** Topic model, word vectors, and transformer models are used to study specific feature processing in the brain during naturalistic speech perception.

**Facilities and Tools** The Group is a part of the newly established Centre for Human Brain Health (CHBH) at the University of Birmingham. The Centre is equipped with state-of-the-art brain imaging facilities, e.g. MEG, OPMs, EEG, MRI, TMS, TCS, Sleep labs, fNIRS. We combine these modalities in order to obtain a comprehensive picture of neural mechanisms of speech and multisensory (AV) integration.

{% include section.html dark=true %}

{% capture col1 %}
**Neural oscillatory mechanisms in** <br>
Auditory perception <br>
Visual perception <br>
Auditory and Visual (speech) tracking <br>
Audio-Visual (speech) integration <br>
Hearing loss and Deafness <br>
Brain reorganisation following sensory loss <br>
Cross-modal plasticity <br>
Speech production <br>
Interpersonal communication (Brain-to-Brain coupling) <br>
Brain-Body-Environment coupling <br>
Saccadic eye movements and audiovisual attention <br>
Rhythmic stimulation using sensory stimulation (rapid frequency tagging) <br>
{% endcapture %}

{% capture col2 %}
**Techniques and Approaches** <br>
SQUID-MEG (Magnetoencephalography) <br>
OPM-MEG (Optically-Pumped Magnetometers) <br>
Ultrasound Stimulation (Low-Intensity Focused Ultrasound Stimulation, LIFU) <br>
Electroencephalography (EEG) <br>
Transcranial Magnetic Stimulation (TMS) <br>
Transcranial Alternating Current Stimulation (tACS) <br>
Diffusion Tensor Imaging (DTI) <br>
Brain Network Analysis <br>
Information Theory Approach: Mutual Information (MI), Transfer Entropy (TE), Partial Information Decomposition (PID) <br>
Computational Neural Architecture using Deep Learning Algorithms <br>
Natural Language Processing (NLP) <br>
Large Language Models (LLMs) <br>
{% endcapture %}

{% include cols.html col1=col1 col2=col2 %}

{% include section.html %}

## Highlights

{% capture text %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

{%
  include button.html
  link="research"
  text="See our publications"
  icon="fa-solid fa-arrow-right"
  flip=true
  style="bare"
%}

{% endcapture %}

{%
  include feature.html
  image="images/photo.jpg"
  link="research"
  title="Our Research"
  text=text
%}

{% capture text %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

{%
  include button.html
  link="projects"
  text="Browse our projects"
  icon="fa-solid fa-arrow-right"
  flip=true
  style="bare"
%}

{% endcapture %}

{%
  include feature.html
  image="images/photo.jpg"
  link="projects"
  title="Our Projects"
  flip=true
  style="bare"
  text=text
%}

{% capture text %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

{%
  include button.html
  link="team"
  text="Meet our team"
  icon="fa-solid fa-arrow-right"
  flip=true
  style="bare"
%}

{% endcapture %}

{%
  include feature.html
  image="images/photo.jpg"
  link="team"
  title="Our Team"
  text=text
%}
