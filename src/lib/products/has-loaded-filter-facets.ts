/** True when filters payload includes at least one facet (not a failed/empty aggregation). */
export function hasLoadedFilterFacets(data: {
  colors: unknown[];
  sizes: unknown[];
  brands: unknown[];
  attributes: Array<{ values: unknown[] }>;
  categoryIds: unknown[];
}): boolean {
  return (
    data.categoryIds.length > 0 ||
    data.colors.length > 0 ||
    data.sizes.length > 0 ||
    data.brands.length > 0 ||
    data.attributes.some((group) => group.values.length > 0)
  );
}
