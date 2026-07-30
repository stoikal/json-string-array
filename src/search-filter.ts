export function filterTableRows(
  container: HTMLElement,
  query: string,
): void {
  const existing = container.querySelector(".no-result");
  if (existing) existing.remove();

  const rows = container.querySelectorAll("tr");
  const lower = query.toLowerCase();
  let visible = 0;
  for (const row of rows) {
    const text = row.textContent?.toLowerCase() ?? "";
    const match = text.includes(lower);
    (row as HTMLElement).style.display = match ? "" : "none";
    if (match) visible++;
  }

  if (visible === 0 && container.querySelector("table")) {
    const noResult = document.createElement("div");
    noResult.className = "no-result";
    noResult.textContent = "no result";
    container.appendChild(noResult);
  }
}
