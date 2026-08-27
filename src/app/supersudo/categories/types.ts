import type { CategoryLocaleTitleMap } from '@/lib/admin/category-locale-helpers';

export interface Category {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  parentIds?: string[];
  requiresSizes?: boolean;
  imageUrl?: string | null;
  published?: boolean;
  translations?: Array<{ locale: string; title: string; slug?: string }>;
  children?: Category[];
}

export interface CategoryWithLevel extends Category {
  level: number;
  /** Unique key for tree rows (category may appear under multiple parents). */
  treeKey: string;
}

export interface CategoryFormData {
  titles: CategoryLocaleTitleMap;
  slug: string;
  parentIds: string[];
  requiresSizes: boolean;
  subcategoryIds: string[];
  imageUrl: string;
  published: 'published' | 'draft';
}




