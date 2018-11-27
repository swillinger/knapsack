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
  /** Output directory */
  dist: string;
  data: string;
  public: string;
  assets: string;
  css: string[];
  js?: string[];
  templates: TemplateRenderers[],
  designTokens: string;
}
