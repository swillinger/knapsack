import { JsonSchemaObject, KnapsackTemplateStatus } from '@knapsack/core/types';
import { KnapsackCustomPageSlice } from './custom-pages';

export { KnapsackTemplateStatus };

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
  /**
   * Would override what was on the template
   */
  assetSetId?: string;
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
  return demo?.type === 'data';
}

export function isTemplateDemo(
  demo: TemplateDemo | DataDemo,
): demo is TemplateDemo {
  return demo?.type === 'template';
}

export type KsSlotInfo = {
  title: string;
  description?: string;
  disallowText?: boolean;
  isRequired?: boolean;
  allowedPatternIds?: string[];
};

/**
 * Supersedes `schema`
 */
export type KsTemplateSpec = {
  /**
   * EXPERMIMENTAL
   * Attempt to create the props & slots spec by reading the source file. Prevents ability to use spec editor.
   * If `true`, then uses the template `alias` & `path` to find the file.
   * If a string, then that file path is used in place of the source file. Scenario: the `path` is used to point to a compiled file w types stripped and this is used to point to either the source file w types or the compiled `.d.ts` file.
   * Currently only React is supported. The file extension determines if TypeScript (ts/tsx) or PropTypes (js/jsx) is used for inference.
   */
  isInferred?: boolean | string;
  /**
   * JSON Schema defining the serializable data passed in
   * The classic, formerly `schema`
   */
  props?: JsonSchemaObject;
  /**
   * Child component slots
   */
  slots?: {
    [name: string]: KsSlotInfo;
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
  spec?: KsTemplateSpec;

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

export interface KnapsackPatternsConfig {
  templateStatuses?: KnapsackTemplateStatus[];
}

export interface KnapsackPatternsData {
  byId: {
    [id: string]: KnapsackPatternTemplate;
  };
}
