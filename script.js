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
