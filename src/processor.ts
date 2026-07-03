export function joinJsonArray(json: string, separator: string): string {
  const arr: string[] = JSON.parse(json);
  return arr.join(separator);
}
