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

interface BedrockCustomPageSlice {
  id: string;
  blockId: string;
  data: Object;
}

interface BedrockCustomPage {
  path: string;
  slices: BedrockCustomPageSlice[];
}

interface BedrockCustomSectionPage {
  id: string;
  title: string;
}

interface BedrockCustomSection {
  id: string;
  title: string;
  showInMainMenu: boolean;
  pages: BedrockCustomSectionPage[];
}
