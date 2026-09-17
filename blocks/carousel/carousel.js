import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const slides = [...block.children];
  block.classList.add('carousel');
debugger;
  // build slide track
  const track = document.createElement('div');
  track.className = 'carousel-track';

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';

  slides.forEach((row, i) => {
    row.classList.add('carousel-slide');

    // optimize the image
    const img = row.querySelector('img');
    if (img) {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, i === 0, [{ width: '1200' }]),
      );
    }

    track.append(row);

    // dot for this slide
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.append(dot);
  });

  // arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '&#10095;';

  block.textContent = '';
  block.append(track, dotsWrap, prevBtn, nextBtn);

  let current = 0;
  const total = slides.length;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // autoplay, pause on hover
  let timer = setInterval(() => goTo(current + 1), 4000);
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 4000);
  });
}