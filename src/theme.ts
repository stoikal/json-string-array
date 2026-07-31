export type ThemeName = "default" | "cute";

const THEME_KEY = "theme";
const THEME_LABEL: Record<ThemeName, string> = {
  default: "Default",
  cute: "Pastel",
};

const SPARKLE_SET: Record<ThemeName, string[]> = {
  default: [],
  cute: ["✨", "💖", "💕", "🌸", "⭐"],
};

export function isTheme(value: string | null): value is ThemeName {
  return value === "default" || value === "cute";
}

export function getTheme(): ThemeName {
  const saved = localStorage.getItem(THEME_KEY);
  return isTheme(saved) ? saved : "default";
}

export function setTheme(theme: ThemeName): void {
  const root = document.documentElement;
  if (theme === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  sparklesOn = theme === "cute";
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(): ThemeName {
  const next = getTheme() === "cute" ? "default" : "cute";
  setTheme(next);
  return next;
}

let sparklesOn = false;
let lastSparkle = 0;

function handleMouseMove(event: MouseEvent): void {
  if (!sparklesOn) return;
  const now = performance.now();
  if (now - lastSparkle < 70) return;
  lastSparkle = now;

  const pool = SPARKLE_SET.cute;
  const el = document.createElement("div");
  el.className = "cursor-sparkle";
  el.textContent = pool[Math.floor(Math.random() * pool.length)];
  el.style.left = `${event.clientX + (Math.random() * 18 - 9)}px`;
  el.style.top = `${event.clientY + (Math.random() * 18 - 9)}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function flashEffect(theme: ThemeName): void {
  const body = document.body;
  body.classList.remove("theme-flash-cute");
  if (theme === "cute") {
    body.classList.add("theme-flash-cute");
    window.setTimeout(() => body.classList.remove("theme-flash-cute"), 700);
  }
}

function showToast(message: string): void {
  let toast = document.querySelector<HTMLDivElement>(".theme-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "theme-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast?.classList.remove("show"), 1500);
}

export function initTheme(): void {
  setTheme(getTheme());
  document.addEventListener("mousemove", handleMouseMove);

  window.addEventListener("keydown", (event) => {
    if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "t") {
      event.preventDefault();
      const theme = toggleTheme();
      flashEffect(theme);
      showToast(`${THEME_LABEL[theme]} theme enabled — Alt+T to switch`);
    }
  });
}
