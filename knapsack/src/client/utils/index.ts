import { KnapsackNavItem } from '../../schemas/nav';

export function getBreadcrumb({
  navItem,
  navItems,
  rootKey = 'root',
}: {
  navItem: KnapsackNavItem;
  navItems: KnapsackNavItem[];
  rootKey?: string;
}): string[] {
  const breadcrumb: string[] = [];
  const getParentItem = (parentId: string): KnapsackNavItem =>
    navItems.find(({ id }) => parentId === id);
  let { parentId } = navItem;
  while (parentId !== rootKey) {
    const parentItem = getParentItem(parentId);
    breadcrumb.push(parentItem.name);
    parentId = parentItem.parentId;
  }
  return breadcrumb.reverse();
}
