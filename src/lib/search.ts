export function getSearchQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export function matchesSearchQuery(
  query: string,
  ...fields: Array<string | undefined>
) {
  if (!query) {
    return true;
  }

  const normalized = query.toLowerCase();
  const haystack = fields.filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(normalized);
}
