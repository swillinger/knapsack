import { JsonSchemaObject } from '@knapsack/core/dist/types';
import { KnapsackCustomPageSlice } from './custom-pages';

/**
 * Used by template renderers in addition to `path`
 * Twig: `@components/button.twig`
 * Web Components: `my-button` => `<my-button>`
 * React: a named export of the file if not `default`
 * @todo Replace this with `rendererOptions`
 */
type TemplateAlias = string;

type SlottedTemplateDemo = {
  patternId: string;
  templateId: string;
  // data: TemplateDemo;
  demoId: DemoBase['id'];
};

type SlottedText = string;

type SlottedData = SlottedText | SlottedTemplateDemo;

export const isSlottedText = (
  slottedData: SlottedData,
): slottedData is SlottedText => typeof slottedData === 'string';

export function isSlottedTemplateDemo(
  slottedData: SlottedData,
): slottedData is SlottedTemplateDemo {
  if (!isSlottedText(slottedData)) {
    return 'patternId' in slottedData;
  }
}

export type KnapsackTemplateData = {
  /**
   * @todo Ideal would be `{ [key: string]: string | boolean | number }`
   */
  props: {
    [prop: string]: any;
  };
  slots?: {
    [slotName: string]: Array<SlottedTemplateDemo | SlottedText>;
  };
  // cssVars?: {
  //   [varName: string]: string;
  // };
};

type DemoType = 'data' | 'template';

interface DemoBase {
  id: string;
  title: string;
  description?: string;
  type: DemoType;
}

/**
 * Shows usage
 */
export interface DataDemo extends DemoBase {
  type: 'data';
  data: KnapsackTemplateData;
}

/**
 * Shows source code
 */
interface TemplateDemo extends DemoBase {
  type: 'template';
  templateInfo: {
    alias?: TemplateAlias;
    path?: string;
  };
}

export type KnapsackTemplateDemo = TemplateDemo | DataDemo;

export type DemoSize = 's' | 'm' | 'l' | 'full';

export function isDataDemo(demo: TemplateDemo | DataDemo): demo is DataDemo {
  return demo.type === 'data';
}

export function isTemplateDemo(
  demo: TemplateDemo | DataDemo,
): demo is TemplateDemo {
  return demo.type === 'template';
}

export interface KnapsackPatternTemplate {
  id: string;
  title?: string;
  /**
   * Relative file path to the template from the config file it is declared in
   */
  path: string;
  alias?: TemplateAlias;
  /**
   * Which template language?
   * i.e. `twig`, `react`
   * Replaces KnapsackTemplateRenderer.test which ran a test on the file path (similar to how WebPack loader `test` works)
   */
  templateLanguageId: string;
  assetSetIds?: string[];
  statusId?: string;
  /**
   * Supersedes `schema`
   */
  spec?: {
    /**
     * JSON Schema defining the serializable data passed in
     * The classic, formerly `schema`
     */
    props?: JsonSchemaObject;
    /**
     * @todo evaluate & refine
     */
    slots?: {
      [name: string]: {
        title: string;
        description?: string;
        disallowText?: boolean;
        allowedPatternIds?: string[];
      };
    };
    /**
     * @todo evaluate & refine
     */
    // cssProps?: {
    //   [name: string]: {
    //     title: string;
    //     description: string;
    //   };
    // };
  };

  /**
   * Supercedes `demoData`, a `{}[]`
   * Supercedes using `templates` for template files that were included with no data passed in and exist to demo how to include/import the source template and render it
   */
  demosById?: {
    [id: string]: TemplateDemo | DataDemo;
  };

  demos?: TemplateDemo['id'][] | DataDemo['id'][];
}

export interface KnapsackPattern {
  id: string;
  title: string;
  description?: string;
  templates: KnapsackPatternTemplate[];
  demoSize?: DemoSize;
  /**
   * Ideal widths to demo, useful for highlighting significant responsive layout changes
   */
  demoWidths?: {
    width: number;
  }[];
  /**
   * Show all templates in a list on one page
   */
  showAllTemplates?: boolean;
  // designs?: PatternDesignSlice['id'][];
  slices?: KnapsackCustomPageSlice[];
}

export interface KnapsackPatternTemplateCode {
  html: string;
  data?: Record<string, any>;
  templateSrc: string;
  usage: string;
  language: string;
}

export interface KnapsackTemplateStatus {
  id: string;
  title: string;
  color?: string;
}

export interface KnapsackPatternsConfig {
  templateStatuses?: KnapsackTemplateStatus[];
}

export interface KnapsackPatternsData {
  byId: {
    [id: string]: KnapsackPatternTemplate;
  };
}
