interface BedrockTemplateRenderResults {
  ok: boolean;
  html?: string;
  message?: string;
}

interface BedrockTemplateRenderer {
  id: string;
  extension: string;
  language?: string;
  test: (theTemplatePath: string) => boolean;
  render: (opt: {
    template: BedrockPatternTemplate;
    pattern: BedrockPattern;
    data?: object;
  }) => Promise<BedrockTemplateRenderResults>;
  build?: (opt: {
    config: BedrockConfig;
    templatePaths: string[];
  }) => Promise<void>;
  watch?: (opt: {
    config: BedrockConfig;
    templatePaths: string[];
  }) => Promise<void>;
  init?: (opt: {
    config: BedrockConfig;
    templatePaths: string[];
    allPatterns: BedrockPattern[];
  }) => void;
  wrapHtml: (opt: {
    html: string;
    cssUrls?: string[];
    jsUrls?: string[];
    headJsUrls?: string[];
    inlineJs?: string;
    inlineCss?: string;
    inlineHead?: string;
    inlineFoot?: string;
  }) => string;
  getHead: (opt: { cssUrls?: string[]; headJsUrls?: string[] }) => string;
  getFoot: (opt: {
    jsUrls?: string[];
    inlineJs?: string;
    inlineCss?: string;
  }) => string;
  onChange: (opt: { path: string }) => void;
  onAdd: (opt: { path: string }) => void;
  onRemove: (opt: { path: string }) => void;
  // renderString: (template: string, data?: object) => Promise<BedrockTemplateRenderResults>,
  getUsage?: (opt: {
    patternId: string;
    template: BedrockPatternTemplate;
    data?: Object;
  }) => Promise<string>;
}

interface BedrockDesignToken {
  name: string;
  value: string;
  category: string;
  tags?: string[];
  originalValue: string;
  code?: string;
  comment?: string;
}

interface BedrockAssetSet {
  id: string;
  title: string;
  assets: {
    src: string;
    publicPath: string;
    type: string;
    sizeKb: string;
    sizeRaw: number;
  }[];
  inlineCss?: string;
  inlineJs?: string;
  inlineHead?: string;
  inlineFoot?: string;
}

interface BedrockAssetSetUserConfig {
  id: string;
  title: string;
  assets: {
    src: string;
  }[];
  inlineCss?: string;
  inlineJs?: string;
  inlineHead?: string;
  inlineFoot?: string;
}

interface BedrockConfig {
  patterns: string[];
  newPatternDir: string;
  /** Output of bedrock build directory */
  dist: string;
  /** Bedrock data including site meta and page builder */
  data: string;
  /** Hosted by bedrock server. Place compiled Design System css and js as well as images and other assets needed by bedrock */
  public: string;
  assetSets: BedrockAssetSetUserConfig[];
  templateRenderers: BedrockTemplateRenderer[];
  designTokens: {
    createCodeSnippet?: (BedrockDesignToken) => string;
    data: {
      tokens: BedrockDesignToken[];
    };
  };
  docsDir?: string;
  changelog?: string;
  version?: string;
}

interface BedrockUserConfig extends BedrockConfig {
  /**
   * Alias for `templateRenderers`
   * @deprecated
   */
  templates?: BedrockTemplateRenderer[];

  /**
   * Paths to css assets located within the public directory or absolute URL
   * Use assetSets
   * @deprecated
   * */
  css?: string[];

  /**
   * Use assetSets
   * @deprecated
   */
  js?: string[];
}
