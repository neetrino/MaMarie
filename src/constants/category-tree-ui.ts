export const CATEGORY_TREE_INDENT_CLASS_BY_LEVEL = [
  'pl-0',
  'pl-4',
  'pl-8',
  'pl-12',
] as const;

export const CATEGORY_TREE_MAX_VISIBLE_LEVEL = CATEGORY_TREE_INDENT_CLASS_BY_LEVEL.length - 1;

export const CATEGORY_TREE_SUBCATEGORY_MARKER = '└';

export function getCategoryTreeIndentClass(level: number): string {
  const cappedLevel = Math.min(Math.max(level, 0), CATEGORY_TREE_MAX_VISIBLE_LEVEL);
  return CATEGORY_TREE_INDENT_CLASS_BY_LEVEL[cappedLevel];
}
