(() => {
  const carousels = document.querySelectorAll('[data-blog-carousel]');
  if (!carousels.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.v26-blog-slide'));
    if (slides.length < 2) return;
    let index = 0;
    window.setInterval(() => {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, 7000);
  });
})();
