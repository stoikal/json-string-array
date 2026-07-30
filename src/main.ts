import "./style.css";
import { onFileSelected } from "./file-reader";
import { setTextareaContent } from "./textarea-sync";
import { joinJsonArray } from "./processor";
import { renderKeyValueTable } from "./table-renderer";
import { filterTableRows } from "./search-filter";

const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const textareaInput = document.getElementById(
  "textareaInput",
) as HTMLTextAreaElement;
const processBtn = document.getElementById("processBtn") as HTMLButtonElement;
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
const searchInput = document.getElementById(
  "searchInput",
) as HTMLInputElement;

function processAndRender(json: string): void {
  const separator = separatorInput.value;
  const firstOnly = firstOnlyCheckbox.checked;
  setTextareaContent(textareaOutput, joinJsonArray(json, ";"));
  renderKeyValueTable(valueDisplayContainer, json, separator, firstOnly);
}

onFileSelected(fileInput, (content) => {
  setTextareaContent(textareaInput, content);
  processAndRender(content);
});

processBtn.addEventListener("click", () => {
  processAndRender(textareaInput.value);
});

function rerenderTable(): void {
  renderKeyValueTable(
    valueDisplayContainer,
    textareaInput.value,
    separatorInput.value,
    firstOnlyCheckbox.checked,
  );
}

separatorInput.addEventListener("input", rerenderTable);
firstOnlyCheckbox.addEventListener("change", rerenderTable);

searchInput.addEventListener("input", () => {
  filterTableRows(valueDisplayContainer, searchInput.value);
});

const copyBtn = document.getElementById("copyBtn")!;
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(textareaOutput.value).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = "Copy Output"; }, 1000);
  });
});
