export function setTextareaContent(
  textarea: HTMLTextAreaElement,
  content: string,
): void {
  textarea.value = content;
  textarea.dispatchEvent(new Event("input"));
}
