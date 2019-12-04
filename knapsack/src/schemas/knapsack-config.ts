import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import { KsCloudConfig } from '@knapsack/core/dist/cloud';
import {
  KnapsackPattern,
  KnapsackPatternTemplate,
  KnapsackTemplateDemo,
} from './patterns';

type Patterns = import('../server/patterns').Patterns;

export interface KnapsackTemplateRendererResults {
  ok: boolean;
  html: string;
  usage?: string;
  templateLanguage?: string;
  message?: string;
}

export interface KsRenderResults extends KnapsackTemplateRendererResults {
  wrappedHtml: string;
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
  /**
   * Used for syntax highlighting
   */
  language?: string;
  build?: (opt: { templatePaths: string[] }) => Promise<void>;
  watch?: (opt: { templatePaths: string[] }) => Promise<void>;
  init?: (opt: { config: KnapsackConfig; patterns: Patterns }) => void;
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
  formatCode: (code: string) => string;
}

export interface KnapsackRenderParams {
  template: KnapsackPatternTemplate;
  pattern: KnapsackPattern;
  demo?: KnapsackTemplateDemo;
  // data?: KnapsackTemplateData;
  patternManifest: Patterns;
}

export type KnapsackRenderFunc = (
  opt: KnapsackRenderParams,
) => Promise<KnapsackTemplateRendererResults>;

export interface KnapsackTemplateRenderer extends KnapsackTemplateRendererBase {
  render: KnapsackRenderFunc;
  // render: (opt: {
  //   template: KnapsackPatternTemplate;
  //   pattern: KnapsackPattern;
  //   demo?: KnapsackTemplateDemo;
  //   data?: KnapsackTemplateData;
  //   patternManifest: Patterns;
  // }) => Promise<KnapsackTemplateRendererResults>;
  // renderString?: (
  //   template: string,
  //   data?: KnapsackTemplateData,
  // ) => Promise<KnapsackTemplateRendererResults>;
  getUsage: (opt: KnapsackRenderParams) => Promise<string>;
  // getUsage?: (opt: {
  //   patternId: string;
  //   template: KnapsackPatternTemplate;
  //   data?: KnapsackTemplateData;
  //   demo?: KnapsackTemplateDemo;
  //   patternManifest: Patterns;
  // }) => Promise<string>;
}

export interface KnapsackConfig {
  /** Output of knapsack build directory */
  dist: string;
  /** Knapsack data including site meta and page builder */
  data: string;
  /** Hosted by knapsack server. Place compiled Design System css and js as well as images and other assets needed by knapsack */
  public: string;
  // assetSets: KnapsackAssetSetsConfig[];
  templateRenderers: KnapsackTemplateRenderer[];
  designTokens: {
    createCodeSnippet?: (token: KnapsackDesignToken) => string;
    data: {
      tokens: KnapsackDesignToken[];
    };
  };
  changelog?: string;
  version?: string;
  cloud?: KsCloudConfig;
}
