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
