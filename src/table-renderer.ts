type SortDir = "asc" | "desc" | null;

let sortCol: number | null = null;
let sortDir: SortDir = null;
let rowData: { index: number; parts: string[] }[] = [];
let containerEl: HTMLElement | null = null;

function splitFirst(s: string, separator: string): string[] {
  const idx = s.indexOf(separator);
  return idx === -1 ? [s] : [s.slice(0, idx), s.slice(idx + separator.length)];
}

function render(): void {
  if (!containerEl) return;

  if (rowData.length === 0) {
    const noResult = document.createElement("div");
    noResult.className = "no-result";
    noResult.textContent = "no result";
    containerEl.replaceChildren(noResult);
    return;
  }

  const sorted = [...rowData];
  if (sortCol !== null && sortDir !== null) {
    sorted.sort((a, b) => {
      const va = a.parts[sortCol!] ?? "";
      const vb = b.parts[sortCol!] ?? "";
      const cmp = va.localeCompare(vb);
      return sortDir === "asc" ? cmp : -cmp;
    });
  } else {
    sorted.sort((a, b) => a.index - b.index);
  }

  const colCount = rowData.reduce((max, r) => Math.max(max, r.parts.length), 0);
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerTr = document.createElement("tr");
  for (let i = 0; i < colCount; i++) {
    const th = document.createElement("th");
    th.textContent = `${i + 1}`;
    if (sortCol === i) {
      th.textContent += sortDir === "asc" ? " \u25B2" : sortDir === "desc" ? " \u25BC" : "";
    }
    th.addEventListener("click", () => {
      if (sortCol === i) {
        if (sortDir === null) sortDir = "asc";
        else if (sortDir === "asc") sortDir = "desc";
        else { sortCol = null; sortDir = null; }
      } else {
        sortCol = i;
        sortDir = "asc";
      }
      render();
    });
    headerTr.appendChild(th);
  }
  thead.appendChild(headerTr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const row of sorted) {
    const tr = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.textContent = row.parts[i] ?? "";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        const val = row.parts[i] ?? "";
        navigator.clipboard.writeText(val).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => { btn.textContent = "Copy"; }, 1000);
        }).catch(() => {
          const textarea = document.createElement("textarea");
          textarea.value = val;
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
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  containerEl.replaceChildren(table);
}

export function renderKeyValueTable(
  container: HTMLElement,
  json: string,
  separator: string,
  firstOnly: boolean,
): void {
  containerEl = container;
  sortCol = null;
  sortDir = null;

  const arr: string[] = JSON.parse(json);
  rowData = arr.map((item, i) => {
    const parts = separator
      ? firstOnly
        ? splitFirst(item, separator)
        : item.split(separator)
      : [item];
    return { index: i, parts };
  });

  render();
}
