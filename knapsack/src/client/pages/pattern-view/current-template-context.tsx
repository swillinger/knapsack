import { createContext } from 'react';
import {
  KnapsackPatternTemplate,
  KnapsackTemplateDemo,
  KsTemplateSpec,
} from '../../../schemas/patterns';
import { KsRenderResults } from '../../../schemas/knapsack-config';

export type CurrentTemplateData = {
  patternId: string;
  templateId: string;
  assetSetId: string;
  template: KnapsackPatternTemplate;
  title: string;
  demo: KnapsackTemplateDemo;
  templateInfo: KsRenderResults & { url: string };
  spec: KsTemplateSpec;
  canEdit: boolean;
  isLocalDev: boolean;
  hasSchema: boolean;
};

export const CurrentTemplateContext = createContext<
  Partial<CurrentTemplateData>
>({});
