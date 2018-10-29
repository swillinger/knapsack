interface GenericResponse {
  ok: boolean;
  message: string;
  data?: object;
}

interface DesignToken {
  name: string;
  value: string;
  comment?: string;
}

interface DesignTokenConfig {
  id: string;
  get: (query?: object) => Promise<DesignToken[]>;
  meta: {
    title: string;
    description?: string;
  }
}

interface PatternMeta {
  title: string;
  type: 'component' | 'layout';
  status: 'draft' | 'inProgress' | 'ready';
  // does not contain all info; just want to stub some in to test
}

interface Pattern {
  id: string;
  meta: PatternMeta;
  // does not contain all info; just want to stub some in to test
}

interface RenderResponse {
  ok: boolean;
  html?: string;
  message?: string;
}

interface Slice {
  id: string;
  patternId: string;
  data: object;
}

interface ExamplePageData {
  id: string;
  title: string;
  slices: Slice[];
}

declare interface BedrockApiServerConfig {
  port: number;
  websocketsPort: number;
  /** Path to `index.html` */
  spaIndexHtmlPath: string;
  baseUrl: string;
  showEndpoints: boolean;
  designTokens: DesignTokenConfig[];
  twigRenderer: {
    render: (template: string, data: object) => RenderResponse;
    renderString: (template: string, data: object) => RenderResponse;
  };

  patterns: {
    getPattern: (id: string) => Pattern;
    getPatterns: () => Pattern[];
    setPatternMeta: (id: string, meta: PatternMeta) => GenericResponse;
    getPatternMeta: (id: string) => PatternMeta;
    createPatternFiles: (config: { id: string }) => GenericResponse;
  };

  examples: {
    getExample: (id: string) => ExamplePageData;
    getExamples: () => ExamplePageData[];
    setExample: (id: string, data: ExamplePageData) => GenericResponse;
  };

  sections: {
    title: string;
    id: string;
    items: {
      title: string;
      id: string;
      src: string;
    }[]
  }[];

  staticDirs: {
    prefix: string;
    path: string;
  };
}
