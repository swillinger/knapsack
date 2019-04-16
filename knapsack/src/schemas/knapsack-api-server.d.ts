interface RenderResponse {
  ok: boolean;
  html?: string;
  message?: string;
}

interface PageBuilderSlice {
  id: string;
  patternId: string;
  data: Object;
}

interface PageBuilderPage {
  id: string;
  title: string;
  description: string;
  slices: PageBuilderSlice[];
}

interface KnapsackCustomPageSlice {
  id: string;
  blockId: string;
  data: Object;
}

interface KnapsackCustomPage {
  path: string;
  slices: KnapsackCustomPageSlice[];
}

interface KnapsackCustomSectionPage {
  id: string;
  title: string;
}

interface KnapsackCustomSection {
  id: string;
  title: string;
  showInMainMenu: boolean;
  pages: KnapsackCustomSectionPage[];
}
