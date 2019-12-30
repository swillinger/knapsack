type KnapsackNavItemId = string;

export type KnapsackNavItem = {
  id: KnapsackNavItemId;
  name?: string;
  path?: string;
  /**
   * Use "root" if you want it at top level
   */
  parentId: KnapsackNavItemId;
};

export interface KnapsackNavsConfig {
  primary: KnapsackNavItem[];
  secondary: KnapsackNavItem[];
}
