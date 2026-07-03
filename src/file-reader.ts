export function onFileSelected(
  input: HTMLInputElement,
  callback: (content: string) => void,
): void {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsText(file);
  });
}
