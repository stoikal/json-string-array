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

function setUrlJson(json: string): void {
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  history.replaceState(null, "", `#json=${b64}`);
}

function processAndRender(json: string): void {
  const separator = separatorInput.value;
  setTextareaContent(textareaOutput, joinJsonArray(json, ";"));
  renderKeyValueTable(valueDisplayContainer, json, separator);
}

onFileSelected(fileInput, (content) => {
  setTextareaContent(textareaInput, content);
  setUrlJson(content);
  processAndRender(content);
});

processBtn.addEventListener("click", () => {
  const json = textareaInput.value;
  setUrlJson(json);
  processAndRender(json);
});

const hash = window.location.hash.slice(1);
const b64 = new URLSearchParams(hash).get("json");
if (b64) {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(escape(atob(padded)));
  setTextareaContent(textareaInput, json);
  processAndRender(json);
}

separatorInput.addEventListener("input", () => {
  renderKeyValueTable(valueDisplayContainer, textareaInput.value, separatorInput.value);
});

searchInput.addEventListener("input", () => {
  filterTableRows(valueDisplayContainer, searchInput.value);
});
