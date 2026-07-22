export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return "";
  const s = String(input);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeUrl(input: unknown): string {
  const s = String(input ?? "");
  // Allow only http/https URLs; otherwise return empty
  if (!/^https?:\/\//i.test(s)) return "";
  return escapeHtml(s);
}
