/** Returns true when `pathname` matches an admin menu route. */
export function isAdminTabPathActive(tabPath: string, pathname: string): boolean {
  return (
    pathname === tabPath ||
    (tabPath === '/supersudo' && pathname === '/supersudo') ||
    (tabPath !== '/supersudo' && pathname.startsWith(tabPath))
  );
}

interface AdminMenuPathItem {
  id: string;
  path: string;
}

/** Longest matching menu path — nested routes resolve to the parent item. */
export function resolveAdminActiveMenuItem<T extends AdminMenuPathItem>(
  pathname: string,
  tabs: readonly T[],
): T | null {
  let best: T | null = null;
  for (const tab of tabs) {
    if (!isAdminTabPathActive(tab.path, pathname)) {
      continue;
    }
    if (!best || tab.path.length > best.path.length) {
      best = tab;
    }
  }
  return best;
}

export function resolveAdminMenuIndex(
  pathname: string,
  tabs: readonly AdminMenuPathItem[],
): number {
  const active = resolveAdminActiveMenuItem(pathname, tabs);
  if (!active) {
    return -1;
  }
  return tabs.findIndex((tab) => tab.id === active.id);
}
