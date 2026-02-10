export function parseTags(tagString) {
  if (!tagString) return [];

  return tagString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
