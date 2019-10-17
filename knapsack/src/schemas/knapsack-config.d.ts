import { KnapsackAssetSetUserConfig } from './asset-sets';
import {
  KnapsackPattern,
  KnapsackPatternTemplate,
} from './knapsack-pattern-manifest.d';

interface KnapsackTemplateRenderResults {
  ok: boolean;
  html?: string;
  message?: string;
}

interface KnapsackTemplateRenderer {
  id: string;
  extension: string;
  language?: string;
  test: (theTemplatePath: string) => boolean;
  render: (opt: {
    template: KnapsackPatternTemplate;
    pattern: KnapsackPattern;
    data?: object;
  }) => Promise<KnapsackTemplateRenderResults>;
  build?: (opt: {
    config: KnapsackConfig;
    templatePaths: string[];
  }) => Promise<void>;
  watch?: (opt: {
    config: KnapsackConfig;
    templatePaths: string[];
  }) => Promise<void>;
  init?: (opt: {
    config: KnapsackConfig;
    templatePaths: string[];
    allPatterns: KnapsackPattern[];
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
  // renderString: (template: string, data?: object) => Promise<KnapsackTemplateRenderResults>,
  getUsage?: (opt: {
    patternId: string;
    template: KnapsackPatternTemplate;
    data?: Record<string, any>;
  }) => Promise<string>;
}

interface KnapsackDesignToken {
  name: string;
  value: string;
  category: string;
  tags?: string[];
  originalValue: string;
  code?: string;
  comment?: string;
}

interface KnapsackConfig {
  patterns: string[];
  newPatternDir: string;
  /** Output of knapsack build directory */
  dist: string;
  /** Knapsack data including site meta and page builder */
  data: string;
  /** Hosted by knapsack server. Place compiled Design System css and js as well as images and other assets needed by knapsack */
  public: string;
  assetSets: KnapsackAssetSetUserConfig[];
  templateRenderers: KnapsackTemplateRenderer[];
  designTokens: {
    createCodeSnippet?: (KnapsackDesignToken) => string;
    data: {
      tokens: KnapsackDesignToken[];
    };
  };
  docsDir?: string;
  changelog?: string;
  version?: string;
}

interface KnapsackUserConfig extends KnapsackConfig {
  /**
   * Alias for `templateRenderers`
   * @deprecated
   */
  templates?: KnapsackTemplateRenderer[];

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
