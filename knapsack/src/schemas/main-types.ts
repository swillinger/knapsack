export type Patterns = import('../server/patterns').Patterns;

export type KnapsackConfig = import('./knapsack-config').KnapsackConfig;

export interface KnapsackBrain {
  patterns: Patterns;
  settings: import('../server/settings').Settings;
  pageBuilderPages: import('../server/page-builder').PageBuilder;
  customPages: import('../server/custom-pages').CustomPages;
  tokens: import('../server/design-tokens').DesignTokens;
  docs: import('../server/docs').Docs;
  config: KnapsackConfig;
}
