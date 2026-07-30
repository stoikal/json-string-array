function splitFirst(s: string, separator: string): string[] {
  const idx = s.indexOf(separator);
  return idx === -1 ? [s] : [s.slice(0, idx), s.slice(idx + separator.length)];
}

export function renderKeyValueTable(
  container: HTMLElement,
  json: string,
  separator: string,
  firstOnly: boolean,
): void {
  const arr: string[] = JSON.parse(json);

  const table = document.createElement("table");
  for (const item of arr) {
    const parts = separator
      ? firstOnly
        ? splitFirst(item, separator)
        : item.split(separator)
      : [item];
    const tr = document.createElement("tr");
    for (const part of parts) {
      const td = document.createElement("td");
      td.textContent = part;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(part).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => { btn.textContent = "Copy"; }, 1000);
        }).catch(() => {
          const textarea = document.createElement("textarea");
          textarea.value = part;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          btn.textContent = "Copied!";
          setTimeout(() => { btn.textContent = "Copy"; }, 1000);
        });
      });
      td.appendChild(btn);

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.replaceChildren(table);
}
