export function filterTableRows(
  container: HTMLElement,
  query: string,
): void {
  const rows = container.querySelectorAll("tr");
  const lower = query.toLowerCase();
  for (const row of rows) {
    const text = row.textContent?.toLowerCase() ?? "";
    (row as HTMLElement).style.display = text.includes(lower) ? "" : "none";
  }
}
