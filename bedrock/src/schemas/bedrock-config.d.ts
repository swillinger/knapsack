interface BedrockTemplateRenderResults {
  ok: boolean;
  html?: string;
  message?: string;
}

interface BedrockTemplateRenderer {
  id: string;
  test: (theTemplatePath: string) => boolean;
  render: (opt: {
    template: BedrockPatternTemplate,
    pattern: BedrockPattern,
    data?: object,
  }) => Promise<BedrockTemplateRenderResults>;
  build?: (opt: {
    config: BedrockConfig,
    templatePaths: string[],
  }) => Promise<void>;
  watch?: (opt: {
    config: BedrockConfig,
    templatePaths: string[],
  }) => Promise<void>;
  init?: (opt: {
    config: BedrockConfig,
    templatePaths: string[],
    allPatterns: BedrockPattern[],
  }) => void;
  wrapHtml: (opt: {
    html: string,
    cssUrls?: string[],
    jsUrls?: string[],
    headJsUrls?: string[]
  }) => string;
  getHead: (opt: {
    cssUrls?: string[],
    headJsUrls?: string[],
  }) => string;
  getFoot: (opt: {
    jsUrls?: string[],
  }) => string;
  onChange: (opt: { path: string }) => void;
  onAdd: (opt: { path: string }) => void;
  onRemove: (opt: { path: string }) => void;
  // renderString: (template: string, data?: object) => Promise<BedrockTemplateRenderResults>,
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

interface BedrockConfig {
  patterns: string[];
  newPatternDir: string;
  /** Output of bedrock build directory */
  dist: string;
  /** Bedrock data including site meta and page builder */
  data: string;
  /** Hosted by bedrock server. Place compiled Design System css and js as well as images and other assets needed by bedrock */
  public: string;
  /** Paths to css assets located within the public directory or absolute URL */
  css?: string[];
  /** Derived from `css` */
  rootRelativeCSS?: string[];
  /** Paths to js assets located within the public directory or absolute URL */
  js?: string[];
  /** Derived from `js` */
  rootRelativeJs?: string[];
  templateRenderers: BedrockTemplateRenderer[],
  designTokens: {
    createCodeSnippet?: (BedrockDesignToken) => string,
    data: {
      tokens: BedrockDesignToken[],
    },
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
  templates?: BedrockTemplateRenderer[],
}
