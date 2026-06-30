export interface Category {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  parentIds?: string[];
  requiresSizes?: boolean;
  imageUrl?: string | null;
  published?: boolean;
  children?: Category[];
}

export interface CategoryWithLevel extends Category {
  level: number;
  /** Unique key for tree rows (category may appear under multiple parents). */
  treeKey: string;
}

export interface CategoryFormData {
  title: string;
  parentIds: string[];
  requiresSizes: boolean;
  subcategoryIds: string[];
  imageUrl: string;
  published: 'published' | 'draft';
}




