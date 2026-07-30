function readFile(file: File, callback: (content: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsText(file);
}

export function onFileSelected(
  input: HTMLInputElement,
  callback: (content: string) => void,
): void {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    readFile(file, callback);
  });
}

export function onFileDrop(
  element: HTMLElement,
  callback: (content: string) => void,
): void {
  element.addEventListener("dragover", (e) => {
    e.preventDefault();
    document.body.classList.add("drag-over");
  });

  element.addEventListener("dragleave", () => {
    document.body.classList.remove("drag-over");
  });

  element.addEventListener("drop", (e) => {
    e.preventDefault();
    document.body.classList.remove("drag-over");
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.name.endsWith(".txt")) return;
    readFile(file, callback);
  });
}
