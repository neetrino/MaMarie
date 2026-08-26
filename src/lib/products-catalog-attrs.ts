export type CatalogAttrsMap = Record<string, string[]>;

const ATTR_GROUP_SEPARATOR = ';';
const ATTR_KEY_SEPARATOR = ':';
const ATTR_VALUE_SEPARATOR = '|';

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

/** Parses `key:value|value;key2:value` catalog attribute query params. */
export function parseCatalogAttrsParam(raw?: string): CatalogAttrsMap {
  if (!raw?.trim()) {
    return {};
  }

  const result: CatalogAttrsMap = {};
  for (const group of raw.split(ATTR_GROUP_SEPARATOR)) {
    const separatorIndex = group.indexOf(ATTR_KEY_SEPARATOR);
    if (separatorIndex <= 0) {
      continue;
    }
    const key = group.slice(0, separatorIndex).trim();
    const values = uniqueSorted(group.slice(separatorIndex + 1).split(ATTR_VALUE_SEPARATOR));
    if (!key || values.length === 0) {
      continue;
    }
    result[key] = values;
  }

  return result;
}

/** Serializes attribute filters into a stable query string, or undefined when empty. */
export function serializeCatalogAttrsParam(attrs: CatalogAttrsMap): string | undefined {
  const groups = Object.keys(attrs)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => {
      const values = uniqueSorted(attrs[key] ?? []);
      if (values.length === 0) {
        return '';
      }
      return `${key}${ATTR_KEY_SEPARATOR}${values.join(ATTR_VALUE_SEPARATOR)}`;
    })
    .filter(Boolean);

  return groups.length > 0 ? groups.join(ATTR_GROUP_SEPARATOR) : undefined;
}

export function toggleCatalogAttrValue(
  attrs: CatalogAttrsMap,
  key: string,
  value: string
): CatalogAttrsMap {
  const current = attrs[key] ?? [];
  const nextValues = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];

  const next: CatalogAttrsMap = { ...attrs };
  if (nextValues.length === 0) {
    delete next[key];
  } else {
    next[key] = nextValues;
  }
  return next;
}
