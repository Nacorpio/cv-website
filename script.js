// Theme toggle: switches between light and dark and remembers the choice.
const root = document.documentElement;                    // the <html> element
const toggle = document.querySelector("#theme-toggle");   // like finding a control by its id

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);                 // CSS reads this attribute
  toggle.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";   // sun / moon
  toggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

// First visit: follow the system setting. Later visits: use the saved choice.
const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved ?? (prefersDark ? "dark" : "light"));

// Like subscribing to an event with += in C#: this runs on every click.
toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

// ---------------------------------------------------------------------------
// Scroll features. Both use IntersectionObserver: the browser tells us when an
// element enters or leaves the viewport, so we don't poll the scroll position.
// (Like an event you subscribe to in C#, instead of a loop checking a value.)
// ---------------------------------------------------------------------------

// 1. Highlight the nav link of the section you are reading.
const navLinks = document.querySelectorAll(".nav-list a");
let atBottom = false;                       // true while the footer is visible

function setActive(id) {
  root.dataset.section = id || "hero";      // CSS tints the background glows by section
  // The section itself gets a soft glow (see .is-current in style.css).
  document.querySelectorAll("main section.block").forEach(section => {
    section.classList.toggle("is-current", section.id === id);
  });

  navLinks.forEach(link => {
    if (link.getAttribute("href") === "#" + id) {
      link.setAttribute("aria-current", "location");   // CSS styles this attribute
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// rootMargin shrinks the "viewport" to a thin band 30-35% from the top.
// A section counts as current while it crosses that band.
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !atBottom) {
      setActive(entry.target.id);           // the hero has no id, so this clears all links
    }
  });
}, { rootMargin: "-30% 0px -65% 0px" });

document.querySelectorAll(".hero, main section[id]").forEach(el => sectionObserver.observe(el));

// The last section (Contact) is short, so it can never reach the band.
// When the footer shows, we are at the very bottom: Contact is the current one.
const footerObserver = new IntersectionObserver(entries => {
  atBottom = entries[0].isIntersecting;
  if (atBottom) {
    setActive("contact");
  }
});
footerObserver.observe(document.querySelector("footer"));

// 2. Fade sections in the first time they scroll into view.
// The class is added here, not in the HTML, so without JavaScript nothing is hidden.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);     // only once: no re-hiding when scrolling back
    }
  });
}, { rootMargin: "0px 0px -10% 0px" });

document.querySelectorAll("main section.block").forEach(section => {
  section.classList.add("reveal");
  revealObserver.observe(section);
});

// 3. Parallax dots: the dot grid moves at 30% of the scroll speed.
// The grid repeats every 24px, so the offset can wrap with % and never jumps.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let ticking = false;

function updateDots() {
  root.style.setProperty("--dots-y", String((window.scrollY * 0.3) % 24));
  updateSymbols();
  ticking = false;
}

// 4. Floating code symbols. Each one has a column (x, in %), a start height (y, in %),
// a size (rem) and a speed. Higher speed = moves faster = looks closer.
const symbolData = [
  ["{ }", 6, 10, 2.2, 0.20], ["</>", 22, 70, 1.6, 0.12], [";", 38, 30, 2.4, 0.28],
  ["//", 52, 85, 1.8, 0.16], ["=>", 66, 20, 1.6, 0.24], ["#", 80, 55, 2.0, 0.14],
  ["[ ]", 92, 90, 1.8, 0.22], ["()", 14, 45, 1.4, 0.30], ["var", 30, 5, 1.4, 0.10],
  ["new", 46, 60, 1.4, 0.18], ["int", 60, 40, 1.6, 0.26], ["< >", 74, 8, 1.8, 0.13],
  ["!=", 86, 35, 1.4, 0.21], ["::", 96, 62, 1.6, 0.17]
];
const symbolLayer = document.createElement("div");
symbolLayer.className = "code-bg";
symbolLayer.setAttribute("aria-hidden", "true");   // decoration only
const symbols = symbolData.map(([text, x, y, size, speed]) => {
  const el = document.createElement("span");
  el.textContent = text;
  el.style.left = x + "%";
  el.style.fontSize = size + "rem";
  symbolLayer.appendChild(el);
  return { el, y, speed };
});
document.body.prepend(symbolLayer);

function updateSymbols() {
  const loop = window.innerHeight + 120;      // a symbol that leaves the top re-enters at the bottom
  symbols.forEach(sym => {
    const start = (sym.y / 100) * window.innerHeight;
    const moved = reduceMotion.matches ? 0 : window.scrollY * sym.speed;
    const y = (((start - moved) % loop) + loop) % loop - 60;   // % can be negative in JS, so wrap twice
    sym.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
  });
}
updateSymbols();
window.addEventListener("resize", updateSymbols);

window.addEventListener("scroll", () => {
  if (reduceMotion.matches || ticking) return;
  ticking = true;
  requestAnimationFrame(updateDots);        // at most once per frame
}, { passive: true });
