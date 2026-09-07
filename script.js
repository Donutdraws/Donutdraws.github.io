const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menu) menu.addEventListener("click", () => nav.classList.toggle("open"));

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".work-item").forEach(item => {
      item.style.display = filter === "all" || item.dataset.category === filter ? "" : "none";
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, {threshold: .12});
document.querySelectorAll(".project-card,.work-item,.about-copy,.about-photo").forEach(el => {
  el.classList.add("fade");
  observer.observe(el);
});

// Lightbox for gallery images
(function(){
  const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  if (!galleryImages.length) return;

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">×</button>
      <button class="lightbox-prev" aria-label="Previous">‹</button>
      <img class="lightbox-img" src="" alt="" />
      <button class="lightbox-next" aria-label="Next">›</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  let currentIndex = 0;

  function openLightbox(index){
    currentIndex = index;
    // Show high-res by replacing src with dataset.full if available
    const src = galleryImages[currentIndex].dataset.full || galleryImages[currentIndex].src;
    lbImg.src = src;
    lbImg.alt = galleryImages[currentIndex].alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function showNext(){
    openLightbox((currentIndex + 1) % galleryImages.length);
  }
  function showPrev(){
    openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  }

  galleryImages.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => { e.preventDefault(); openLightbox(i); });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Optional: swipe support for touch devices
  let touchStartX = 0;
  lbImg.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; });
  lbImg.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) showNext(); else showPrev();
    }
  });
})();
