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
