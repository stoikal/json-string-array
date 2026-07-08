export function renderKeyValueTable(
  container: HTMLElement,
  json: string,
  separator: string,
): void {
  const arr: string[] = JSON.parse(json);

  const table = document.createElement("table");
  for (const item of arr) {
    const parts = separator ? item.split(separator) : [item];
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
          setTimeout(() => { btn.textContent = "Copy"; }, 1500);
        });
      });
      td.appendChild(btn);

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.replaceChildren(table);
}
