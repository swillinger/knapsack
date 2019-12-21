import { createContext } from 'react';
import {
  KnapsackPatternTemplate,
  KnapsackTemplateDemo,
  KsTemplateSpec,
} from '../../../schemas/patterns';
import { KsRenderResults } from '../../../schemas/knapsack-config';

export type CurrentTemplateData = {
  patternId: string;
  pattern: KnapsackPattern;
  templateId: string;
  template: KnapsackPatternTemplate;
  assetSetId: string;
  title: string;
  demo: KnapsackTemplateDemo;
  demos: KnapsackTemplateDemo[];
  templateInfo: KsRenderResults & { url: string };
  spec: KsTemplateSpec;
  canEdit: boolean;
  isLocalDev: boolean;
  hasSchema: boolean;
  setDemo: (demo: KnapsackTemplateDemo) => void;
};

export const CurrentTemplateContext = createContext<
  Partial<CurrentTemplateData>
>({});
