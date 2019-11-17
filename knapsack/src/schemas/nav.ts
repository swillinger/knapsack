type KnapsackNavItemId = string;

export type KnapsackNavItem = {
  id: KnapsackNavItemId;
  /**
   * We try to automatically look this up client-side
   */
  name?: string;
  path?: string;
  parentId: KnapsackNavItemId;
};

export interface KnapsackNavsConfig {
  primary: KnapsackNavItem[];
  secondary: KnapsackNavItem[];
}
