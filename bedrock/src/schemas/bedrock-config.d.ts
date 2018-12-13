interface BedrockTemplateRenderResults {
  ok: boolean;
  html?: string;
  message?: string;
}

interface BedrockTemplateRenderer {
  id: string
  test: (theTemplatePath: string) => boolean;
  render: (templatePath: string, data?: object) => Promise<BedrockTemplateRenderResults>,
  wrapHtml: (opt: {
    html: string,
    cssUrls?: string[],
    jsUrls?: string[],
    headJsUrls?: string[]
  }) => string,
  getHead: (opt: {
    cssUrls?: string[],
    headJsUrls?: string[],
  }) => string;
  getFoot: (opt: {
    jsUrls?: string[],
  }) => string;
  // renderString: (template: string, data?: object) => Promise<BedrockTemplateRenderResults>,
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
  /** Paths to js assets located within the public directory or absolute URL */
  js?: string[];
  templates: BedrockTemplateRenderer[],
  designTokens: string;
  docsDir?: string;
}
