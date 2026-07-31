export type ThemeName = "default" | "cute";

const THEME_KEY = "theme";

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
    restoreOriginalText();
  } else {
    root.setAttribute("data-theme", theme);
    applyPastelText();
  }
  sparklesOn = theme === "cute";
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(): ThemeName {
  const next = getTheme() === "cute" ? "default" : "cute";
  setTheme(next);
  return next;
}

/* ------- emoji burst (glitter bomb) ------- */
const BURST_EMOJIS = ["✨", "💖", "💕", "🌸", "🍓", "🥺", "🫶", "🧁", "🎀", "💅", "⭐", "🍑", "🌈", "🧸"];

function emojiBurst(): void {
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.className = "burst-emoji";
    el.textContent = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${Math.random() * 100}vh`;
    el.style.fontSize = `${1 + Math.random() * 2}rem`;
    el.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* ------- sparkle cursor trail ------- */
const SPARKLES = ["✨", "💖", "💕", "🌸", "⭐"];
let sparklesOn = false;
let lastSparkle = 0;

function handleMouseMove(event: MouseEvent): void {
  if (!sparklesOn) return;
  const now = performance.now();
  if (now - lastSparkle < 70) return;
  lastSparkle = now;

  const el = document.createElement("div");
  el.className = "cursor-sparkle";
  el.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
  el.style.left = `${event.clientX + (Math.random() * 18 - 9)}px`;
  el.style.top = `${event.clientY + (Math.random() * 18 - 9)}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

/* ------- sarcastic copy swaps ------- */
let originalsReady = false;
const originalText: Record<string, string> = {};

function captureOriginals(): void {
  if (originalsReady) return;
  originalsReady = true;
  const h1 = document.querySelector("h1");
  const subtitle = document.querySelector(".subtitle");
  const footer = document.querySelector("footer p");
  const fileLabel = document.querySelector(".file-label span");
  const textareaInput = document.getElementById("textareaInput") as HTMLTextAreaElement | null;
  const textareaOutput = document.getElementById("textareaOutput") as HTMLTextAreaElement | null;
  const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
  originalText.title = document.title;
  if (h1) originalText.h1 = h1.textContent ?? "";
  if (subtitle) originalText.subtitle = subtitle.textContent ?? "";
  if (footer) originalText.footer = footer.textContent ?? "";
  if (fileLabel) originalText.fileLabel = fileLabel.textContent ?? "";
  if (textareaInput) originalText.textareaInput = textareaInput.placeholder;
  if (textareaOutput) originalText.textareaOutput = textareaOutput.placeholder;
  if (searchInput) originalText.searchInput = searchInput.placeholder;
}

function applyPastelText(): void {
  captureOriginals();
  document.title = "json-string-array ~*~ SLAY ~*~";
  const h1 = document.querySelector("h1");
  const subtitle = document.querySelector(".subtitle");
  const footer = document.querySelector("footer p");
  const fileLabel = document.querySelector(".file-label span");
  const textareaInput = document.getElementById("textareaInput") as HTMLTextAreaElement | null;
  const textareaOutput = document.getElementById("textareaOutput") as HTMLTextAreaElement | null;
  const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
  if (h1) h1.textContent = "JSON String Array ~*~ SLAY ~*~";
  if (subtitle) subtitle.textContent = "Split & search JSON arrays — no thoughts, just vibes ✨";
  if (footer) footer.textContent = "All processing happens 100% locally — no data sent anywhere, promise. you're doing amazing sweetie ✨";
  if (fileLabel) fileLabel.textContent = "Upload .txt file please 🥺";
  if (textareaInput) textareaInput.placeholder = '["enter","your","adorable","json"]';
  if (textareaOutput) textareaOutput.placeholder = "your sparkly results appear here ✨";
  if (searchInput) searchInput.placeholder = "filter... darling ✨";
}

function restoreOriginalText(): void {
  if (!originalsReady) return;
  document.title = originalText.title;
  const h1 = document.querySelector("h1");
  const subtitle = document.querySelector(".subtitle");
  const footer = document.querySelector("footer p");
  const fileLabel = document.querySelector(".file-label span");
  const textareaInput = document.getElementById("textareaInput") as HTMLTextAreaElement | null;
  const textareaOutput = document.getElementById("textareaOutput") as HTMLTextAreaElement | null;
  const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
  if (h1) h1.textContent = originalText.h1;
  if (subtitle) subtitle.textContent = originalText.subtitle;
  if (footer) footer.textContent = originalText.footer;
  if (fileLabel) fileLabel.textContent = originalText.fileLabel;
  if (textareaInput) textareaInput.placeholder = originalText.textareaInput;
  if (textareaOutput) textareaOutput.placeholder = originalText.textareaOutput;
  if (searchInput) searchInput.placeholder = originalText.searchInput;
}

/* ------- theme switch effects ------- */
const PASTEL_TOASTS = [
  "~*~*~* PASTEL MODE ENGAGED *~*~*~",
  "you're doing amazing sweetie ✨",
  "SLAY ✨",
  "extremely wholesome energy activated 🥹",
  "no thoughts, just sparkles ✨",
  "certified drama-free zone 🥹",
];

const DEFAULT_TOASTS = [
  "back to boring. okay. 😐",
  "default mode. very demure.",
  "you chose productivity 🙃",
  "aww, leaving the sparkles behind?",
];

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

function flashEffect(theme: ThemeName): void {
  const body = document.body;
  body.classList.remove("theme-flash-cute");
  if (theme === "cute") {
    body.classList.add("theme-flash-cute");
    window.setTimeout(() => body.classList.remove("theme-flash-cute"), 700);
    emojiBurst();
    showToast(PASTEL_TOASTS[Math.floor(Math.random() * PASTEL_TOASTS.length)]);
  } else {
    showToast(DEFAULT_TOASTS[Math.floor(Math.random() * DEFAULT_TOASTS.length)]);
  }
}

export function initTheme(): void {
  setTheme(getTheme());
  document.addEventListener("mousemove", handleMouseMove);

  window.addEventListener("keydown", (event) => {
    if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "t") {
      event.preventDefault();
      flashEffect(toggleTheme());
    }
  });
}
