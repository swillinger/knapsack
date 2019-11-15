type KnapsackNavItemId = string;

export type KnapsackNavItem = {
  id: KnapsackNavItemId;
  name: string;
  path?: string;
  parentId: KnapsackNavItemId;
};

export interface KnapsackNavsConfig {
  primary: KnapsackNavItem[];
  secondary: KnapsackNavItem[];
}
