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
const valueDisplayContainer = document.getElementById(
  "valueDisplayContainer",
) as HTMLDivElement;
const searchInput = document.getElementById(
  "searchInput",
) as HTMLInputElement;

function processAndRender(json: string): void {
  const separator = separatorInput.value;
  setTextareaContent(textareaOutput, joinJsonArray(json, ";"));
  renderKeyValueTable(valueDisplayContainer, json, separator);
}

onFileSelected(fileInput, (content) => {
  setTextareaContent(textareaInput, content);
  processAndRender(content);
});

processBtn.addEventListener("click", () => {
  processAndRender(textareaInput.value);
});

separatorInput.addEventListener("input", () => {
  renderKeyValueTable(valueDisplayContainer, textareaInput.value, separatorInput.value);
});

searchInput.addEventListener("input", () => {
  filterTableRows(valueDisplayContainer, searchInput.value);
});

document.getElementById("copyBtn")!.addEventListener("click", () => {
  navigator.clipboard.writeText(textareaOutput.value);
});
