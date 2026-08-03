(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-image-carousel]').forEach((carousel) => {
    const images = Array.from(carousel.querySelectorAll('.v26-card-image'));
    if (images.length < 2 || reduceMotion) return;
    let current = 0;
    window.setInterval(() => {
      images[current].classList.remove('is-active');
      current = (current + 1) % images.length;
      images[current].classList.add('is-active');
    }, 5000);
  });

  document.querySelectorAll('[data-post-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-post-track]');
    const cards = Array.from(track.querySelectorAll('[data-blog-card]'));
    const prev = carousel.querySelector('[data-post-prev]');
    const next = carousel.querySelector('[data-post-next]');
    if (!track || cards.length < 2 || !prev || !next) return;

    let index = 0;
    let timer;
    const visibleCount = () => window.matchMedia('(max-width: 760px)').matches ? 1 : window.matchMedia('(max-width: 1050px)').matches ? 2 : 3;
    const maxIndex = () => Math.max(0, cards.length - visibleCount());
    const update = () => {
      index = Math.min(index, maxIndex());
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const cardWidth = cards[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    };
    const go = (direction) => {
      index += direction;
      if (index > maxIndex()) index = 0;
      if (index < 0) index = maxIndex();
      update();
    };
    const restart = () => {
      window.clearInterval(timer);
      if (!reduceMotion && maxIndex() > 0) timer = window.setInterval(() => go(1), 5000);
    };

    prev.addEventListener('click', () => { go(-1); restart(); });
    next.addEventListener('click', () => { go(1); restart(); });
    carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
    carousel.addEventListener('mouseleave', restart);
    carousel.addEventListener('focusin', () => window.clearInterval(timer));
    carousel.addEventListener('focusout', restart);
    window.addEventListener('resize', () => { index = 0; update(); restart(); });
    update();
    restart();
  });
})();
