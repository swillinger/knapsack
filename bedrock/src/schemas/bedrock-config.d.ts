interface TemplateRenderResponse {
  ok: boolean;
  html?: string;
  message?: string;
}

interface TemplateRenderers {
  test: (theTemplatePath: string) => boolean;
  render: (template: string, data?: object) => Promise<TemplateRenderResponse>,
  renderString: (template: string, data?: object) => Promise<TemplateRenderResponse>,
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
  /** Root relative paths to css assets located within the public directory */
  css: string[];
  /** Root relative paths to js assets located within the public directory */
  js?: string[];
  templates: TemplateRenderers[],
  designTokens: string;
  docsDir?: string;
}
