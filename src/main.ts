import "./style.css";
import { initTheme } from "./theme";
import { onFileSelected, onFileDrop } from "./file-reader";
import { setTextareaContent } from "./textarea-sync";
import { joinJsonArray } from "./processor";
import { renderKeyValueTable } from "./table-renderer";
import { filterTableRows } from "./search-filter";

initTheme();

const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const textareaInput = document.getElementById(
  "textareaInput",
) as HTMLTextAreaElement;
const textareaOutput = document.getElementById(
  "textareaOutput",
) as HTMLTextAreaElement;
const separatorInput = document.getElementById(
  "separatorInput",
) as HTMLInputElement;
const firstOnlyCheckbox = document.getElementById(
  "firstOnlyCheckbox",
) as HTMLInputElement;
const valueDisplayContainer = document.getElementById(
  "valueDisplayContainer",
) as HTMLDivElement;
{
  const el = document.createElement("div");
  el.className = "no-result";
  el.textContent = "no result";
  valueDisplayContainer.appendChild(el);
}
const searchInput = document.getElementById(
  "searchInput",
) as HTMLInputElement;
const outputSeparatorInput = document.getElementById(
  "outputSeparatorInput",
) as HTMLInputElement;

function processAndRender(json: string): void {
  const separator = separatorInput.value;
  const firstOnly = firstOnlyCheckbox.checked;
  setTextareaContent(textareaOutput, joinJsonArray(json, outputSeparatorInput.value));
  renderKeyValueTable(valueDisplayContainer, json, separator, firstOnly);
}

onFileSelected(fileInput, (content) => {
  setTextareaContent(textareaInput, content);
  processAndRender(content);
});

const main = document.querySelector("main")!;
onFileDrop(main, (content) => {
  setTextareaContent(textareaInput, content);
  processAndRender(content);
});

let debounceTimer: number | undefined;
textareaInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    try {
      processAndRender(textareaInput.value);
    } catch {
      // invalid JSON while typing — do nothing
    }
  }, 400);
});

function rerenderTable(): void {
  try {
    renderKeyValueTable(
      valueDisplayContainer,
      textareaInput.value,
      separatorInput.value,
      firstOnlyCheckbox.checked,
    );
  } catch {
    // invalid JSON while typing — do nothing
  }
}

separatorInput.addEventListener("input", rerenderTable);
firstOnlyCheckbox.addEventListener("change", rerenderTable);
outputSeparatorInput.addEventListener("input", () => {
  try {
    setTextareaContent(textareaOutput, joinJsonArray(textareaInput.value, outputSeparatorInput.value));
  } catch {
    // invalid JSON while typing — do nothing
  }
});

searchInput.addEventListener("input", () => {
  filterTableRows(valueDisplayContainer, searchInput.value);
});

const copyBtn = document.getElementById("copyBtn")!;
copyBtn.addEventListener("click", () => {
  textareaOutput.select();
  navigator.clipboard.writeText(textareaOutput.value).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = "Copy Output"; }, 1000);
  });
});
