import {
  CATEGORY_TREE_SUBCATEGORY_MARKER,
  getCategoryTreeIndentClass,
} from '../../constants/category-tree-ui';

type CategoryHierarchyTone = 'admin' | 'catalog';

interface CategoryHierarchyLabelProps {
  title: string;
  level: number;
  selected?: boolean;
  tone?: CategoryHierarchyTone;
  indented?: boolean;
}

export function CategoryHierarchyLabel({
  title,
  level,
  selected = false,
  tone = 'admin',
  indented = true,
}: CategoryHierarchyLabelProps) {
  const isSubcategory = level > 0;
  const titleClass = getHierarchyTitleClass(tone, isSubcategory, selected);
  const indentClass = indented ? getCategoryTreeIndentClass(level) : '';

  return (
    <span className={`flex min-w-0 items-center gap-1.5 ${indentClass}`}>
      {isSubcategory ? (
        <span className="shrink-0 text-gray-300" aria-hidden>
          {CATEGORY_TREE_SUBCATEGORY_MARKER}
        </span>
      ) : null}
      <span className={`truncate ${titleClass}`}>{title}</span>
    </span>
  );
}

function getHierarchyTitleClass(
  tone: CategoryHierarchyTone,
  isSubcategory: boolean,
  selected: boolean,
): string {
  if (tone === 'catalog') {
    if (selected) {
      return 'font-semibold text-gray-900';
    }
    return isSubcategory ? 'font-medium text-[#555]' : 'font-medium text-gray-900';
  }

  if (selected || !isSubcategory) {
    return 'text-sm font-semibold text-gray-900';
  }

  return 'text-xs font-medium text-gray-500';
}
