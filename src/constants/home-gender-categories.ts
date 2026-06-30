/** Category slugs for home hero girls / boys shop CTAs. */
export const HOME_GENDER_CATEGORY_SLUG = {
  girls: 'girls',
  boys: 'boys',
} as const;

export type HomeGenderCategorySlug =
  (typeof HOME_GENDER_CATEGORY_SLUG)[keyof typeof HOME_GENDER_CATEGORY_SLUG];

/** Products catalog URL filtered by a gender category. */
export function homeGenderCategoryProductsHref(slug: HomeGenderCategorySlug): string {
  return `/products?category=${slug}`;
}
