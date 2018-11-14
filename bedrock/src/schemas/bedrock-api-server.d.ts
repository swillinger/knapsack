/**
 * Theo Design Token
 */
interface DesignToken {
  name: string;
  value: string;
  originalValue: string;
  category: string;
  type: string;
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

interface BedrockApiServerConfig {
  port: number;
  public?: string;
  webroot?: string;
  websocketsPort?: number;
  baseUrl: string;
  showEndpoints?: boolean;
  designTokens?: DesignTokenConfig[];
  twigRenderer?: {
    render: (template: string, data: object) => RenderResponse;
    renderString: (template: string, data: object) => RenderResponse;
  };

  templateRenderers: TemplateRenderers[]

  patternManifest: BedrockPatternManifest;

  // patterns?: {
  //   getPattern: (id: string) => PatternSchema;
  //   getPatterns: () => PatternSchema[];
  //   setPatternMeta: (id: string, meta: PatternMetaSchema) => GenericResponse;
  //   getPatternMeta: (id: string) => PatternMetaSchema;
  //   createPatternFiles: (config: { id: string }) => GenericResponse;
  // };

  // examples?: {
  //   getExample: (id: string) => ExamplePageData;
  //   getExamples: () => ExamplePageData[];
  //   setExample: (id: string, data: ExamplePageData) => GenericResponse;
  // };

  exampleStore: ExampleStore;

  sections?: {
    title: string;
    id: string;
    items: {
      title: string;
      id: string;
      src: string;
    }[]
  }[];

  settingsStore: SettingsStore;

  staticDirs?: {
    prefix: string;
    path: string;
  }[];

  css?: string[];
  js?: string[];
}

interface Endpoint {
  pathname: string;
  method: string;
}
