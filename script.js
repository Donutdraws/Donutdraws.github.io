// Donut Draws — site interactions + automatic artwork gallery
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menu) menu.addEventListener("click", () => nav.classList.toggle("open"));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, {threshold: .12});

function observeAnimations() {
  document.querySelectorAll(".project-card,.work-item,.about-copy,.about-photo").forEach(el => {
    if (!el.classList.contains("fade")) {
      el.classList.add("fade");
      observer.observe(el);
    }
  });
}

/*
  AUTOMATIC ARTWORK GALLERY
  --------------------------------------------------
  Add JPG/PNG/WebP/GIF images to: assets/art/
  No HTML editing is needed.

  Optional naming:
    Home Is A Feeling.jpg
    character - hedgehog.png
    story - webtoon page 01.jpg

  The word before " - " can be used as a category:
    illustration, character, story
*/
const REPO_API = "https://api.github.com/repos/Donutdraws/Donutdraws.github.io/contents/assets/art";
const IMAGE_TYPES = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

function parseArtwork(item) {
  // Recommended filename format:
  // Title__category__year__description.jpg
  // Example: Floating in My Head__illustration__2026__A surreal self portrait about imagination.png
  const base = item.name.replace(/\.[^.]+$/, '');
  const parts = base.split('__').map(x => x.trim());
  const title = (parts[0] || 'Untitled').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const rawCategory = (parts[1] || '').toLowerCase();
  let category = 'illustration';
  if (rawCategory.includes('character')) category = 'character';
  else if (rawCategory.includes('story') || rawCategory.includes('webtoon') || rawCategory.includes('comic')) category = 'story';
  const year = /^20\d{2}$/.test(parts[2]) ? parts[2] : '2026';
  const description = parts[3] || `A ${category === 'character' ? 'character design' : category === 'story' ? 'visual storytelling piece' : 'digital illustration'} by Donut Draws.`;
  const categoryName = category === 'character' ? 'Character Design' : category === 'story' ? 'Visual Storytelling' : 'Digital Illustration';
  return { ...item, title, category, categoryName, year, description, url: imageUrl(item) };
}

function cleanTitle(filename) { return parseArtwork({name: filename}).title; }

function getCategory(filename) { return parseArtwork({name: filename}).category; }

function imageUrl(item) {
  return item.download_url || `https://raw.githubusercontent.com/Donutdraws/Donutdraws.github.io/main/assets/art/${encodeURIComponent(item.name)}`;
}

async function getArtworks() {
  const response = await fetch(REPO_API, {cache: "no-store"});
  if (!response.ok) throw new Error("Could not load artwork folder.");
  const files = await response.json();
  return files.filter(item => item.type === "file" && IMAGE_TYPES.test(item.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}))
    .map(parseArtwork);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function artworkCard(item, index) {
  return `
    <article class="work-item ${index === 0 ? "tall" : ""}" data-category="${escapeHtml(item.category)}">
      <button class="art-open" type="button" aria-label="Open ${escapeHtml(item.title)}" data-art-index="${index}">
        <div class="art-placeholder actual-art"><img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title)}" loading="lazy"></div>
      </button>
      <div class="work-info"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.categoryName)} · ${escapeHtml(item.year)}</p></div><span class="view-art">View ↗</span></div>
      <p class="art-description">${escapeHtml(item.description)}</p>
    </article>`;
}

let currentArtworks = [];
function openLightbox(index) {
  const item = currentArtworks[index];
  if (!item) return;
  const box = document.querySelector('#art-lightbox');
  box.querySelector('.lightbox-image').src = item.url;
  box.querySelector('.lightbox-image').alt = item.title;
  box.querySelector('.lightbox-title').textContent = item.title;
  box.querySelector('.lightbox-meta').textContent = `${item.categoryName} · ${item.year}`;
  box.querySelector('.lightbox-description').textContent = item.description;
  box.classList.add('open');
  document.body.classList.add('lightbox-open');
}
function closeLightbox() {
  document.querySelector('#art-lightbox')?.classList.remove('open');
  document.body.classList.remove('lightbox-open');
}
function setupLightbox() {
  if (document.querySelector('#art-lightbox')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="lightbox" id="art-lightbox" role="dialog" aria-modal="true" aria-label="Artwork viewer">
      <button class="lightbox-close" type="button" aria-label="Close artwork">×</button>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-details"><p class="lightbox-meta"></p><h2 class="lightbox-title"></h2><p class="lightbox-description"></p></div>
      </div>
    </div>`);
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('#art-lightbox').addEventListener('click', e => { if (e.target.id === 'art-lightbox') closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}


function setupFilters() {
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
}

async function loadWorkPage() {
  const grid = document.querySelector("#work-grid");
  if (!grid) return;

  try {
    const artworks = await getArtworks();

    if (!artworks.length) {
      grid.innerHTML = '<p class="gallery-empty">No artwork uploaded yet. Add images to <strong>assets/art/</strong>.</p>';
      return;
    }

    currentArtworks = artworks;
    grid.innerHTML = artworks.map(artworkCard).join("");
    setupLightbox();
    grid.querySelectorAll(".art-open").forEach(btn => btn.addEventListener("click", () => openLightbox(Number(btn.dataset.artIndex))));
    setupFilters();
    observeAnimations();
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="gallery-empty">Artwork could not be loaded right now.</p>';
  }
}

async function loadFeatured() {
  const grid = document.querySelector("#featured-grid");
  if (!grid) return;

  try {
    const artworks = await getArtworks();
    const featured = artworks.slice(0, 3);

    if (!featured.length) {
      grid.innerHTML = '<p class="gallery-empty">Add your artwork to <strong>assets/art/</strong> and it will appear here automatically.</p>';
      return;
    }

    grid.innerHTML = featured.map((item, i) => {
      const category = getCategory(item.name);
      const categoryName = category === "character" ? "Character Design" :
                           category === "story" ? "Visual Storytelling" :
                           "Digital Illustration";
      return `
        <a class="project-card ${i === 0 ? "large" : ""}" href="work.html">
          <div class="art-placeholder ${i === 0 ? "art-one" : i === 1 ? "art-two" : "art-three"} actual-art">
            <img src="${imageUrl(item)}" alt="${cleanTitle(item.name)}" loading="lazy">
          </div>
          <div class="card-meta"><span>${categoryName}</span><b>${String(i + 1).padStart(2,"0")}</b></div>
        </a>`;
    }).join("");

    observeAnimations();
  } catch (error) {
    console.error(error);
  }
}

loadWorkPage();
observeAnimations();
