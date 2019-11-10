import { KnapsackDesignToken } from '@knapsack/core';
import { KnapsackAssetSetUserConfig } from './asset-sets';
import { KnapsackPattern, KnapsackPatternTemplate } from './patterns';

export interface KnapsackTemplateRenderResults {
  ok: boolean;
  html: string;
  message?: string;
}

export interface GetHeadParams {
  cssUrls?: string[];
  headJsUrls?: string[];
  inlineHead?: string;
}
export interface GetFootParams {
  jsUrls?: string[];
  inlineJs?: string;
  inlineCss?: string;
  inlineFoot?: string;
}

export interface KnapsackTemplateRendererBase {
  id: string;
  extension: string;
  language?: string;
  test: (theTemplatePath: string) => boolean;
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
  wrapHtml: (
    opt: {
      html: string;
    } & GetHeadParams &
      GetFootParams,
  ) => string;
  getHead: (opt: GetHeadParams) => string;
  getFoot: (opt: GetFootParams) => string;
  onChange: (opt: { path: string }) => void;
  onAdd: (opt: { path: string }) => void;
  onRemove: (opt: { path: string }) => void;
}

export interface KnapsackTemplateRenderer extends KnapsackTemplateRendererBase {
  render: (opt: {
    template: KnapsackPatternTemplate;
    pattern: KnapsackPattern;
    data?: object;
  }) => Promise<KnapsackTemplateRenderResults>;
  renderString?: (
    template: string,
    data?: object,
  ) => Promise<KnapsackTemplateRenderResults>;
  getUsage?: (opt: {
    patternId: string;
    template: KnapsackPatternTemplate;
    data?: Record<string, any>;
  }) => Promise<string>;
}

export interface KnapsackConfig {
  patterns: string[];
  /**
   * @deprecated
   */
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
    createCodeSnippet?: (token: KnapsackDesignToken) => string;
    data: {
      tokens: KnapsackDesignToken[];
    };
  };
  docsDir?: string;
  changelog?: string;
  version?: string;
}

export interface KnapsackUserConfig extends KnapsackConfig {
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
