interface TokenGroupDef {
  id: string;
  title: string;
  description: string;
  tokenCategoryIds: string[];
}

interface TokenGroup {
  id: string;
  title: string;
  path: string;
  description: string;
  tokenCategoryIds: string[];
  tokenCategories: TokenCategory[];
}

interface TokenCategory {
  id: string;
  name: string;
  hasDemo: boolean;
  tokens: DesignToken[];
}

interface DesignToken {
  type: string;
  category: string;
  value: string;
  originalValue: string;
  name: string;
  comment?: string;
}
