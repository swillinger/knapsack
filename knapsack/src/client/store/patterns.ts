import produce from 'immer';
import shortid from 'shortid';
import { Action } from './types';
import {
  KnapsackPattern,
  KnapsackPatternsConfig,
  KnapsackPatternTemplate,
  KnapsackTemplateDemo,
} from '../../schemas/patterns';
import { KnapsackCustomPageSlice } from '../../schemas/custom-pages';

type PatternsState = {
  isFetching?: boolean;
  didInvalidate?: boolean;
  patterns: {
    [id: string]: KnapsackPattern;
  };
  // nav: [];
} & KnapsackPatternsConfig;

const initialState: PatternsState = {
  isFetching: false,
  didInvalidate: false,
  patterns: {},
};

const UPDATE_TEMPLATE_DEMO = 'knapsack/patterns/UPDATE_TEMPLATE_DEMO';
const REMOVE_TEMPLATE_DEMO = 'knapsack/patterns/REMOVE_TEMPLATE_DEMO';
const ADD_TEMPLATE_DATA_DEMO = 'knapsack/patterns/ADD_TEMPLATE_DATA_DEMO';
const UPDATE_PATTERN = 'knapsack/patterns/UPDATE_PATTERN';
const UPDATE_PATTERN_INFO = 'knapsack/patterns/UPDATE_PATTERN_INFO';
const UPDATE_TEMPLATE_INFO = 'knapsack/patterns/UPDATE_TEMPLATE_INFO';
const UPDATE_PATTERN_SLICES = 'knapsack/patterns/UPDATE_PATTERN_SLICES';

interface UpdatePatternSlicesAction extends Action {
  type: typeof UPDATE_PATTERN_SLICES;
  payload: {
    patternId: string;
    slices: KnapsackCustomPageSlice[];
  };
}

export function updatePatternSlices(
  patternId: string,
  slices: KnapsackCustomPageSlice[],
): UpdatePatternSlicesAction {
  return {
    type: UPDATE_PATTERN_SLICES,
    payload: {
      patternId,
      slices,
    },
  };
}

interface UpdateTemplateDemoAction extends Action {
  type: typeof UPDATE_TEMPLATE_DEMO;
  payload: {
    patternId: string;
    templateId: string;
    demo: KnapsackTemplateDemo;
  };
}

export function updateTemplateDemo({
  patternId,
  templateId,
  demo,
}: {
  patternId: string;
  templateId: string;
  demo: KnapsackTemplateDemo;
}): UpdateTemplateDemoAction {
  return {
    type: UPDATE_TEMPLATE_DEMO,
    payload: {
      patternId,
      templateId,
      demo,
    },
  };
}

interface AddTemplateDataDemoAction extends Action {
  type: typeof ADD_TEMPLATE_DATA_DEMO;
  payload: {
    patternId: string;
    templateId: string;
  };
}

export function addTemplateDataDemo({
  patternId,
  templateId,
}: {
  patternId: string;
  templateId: string;
}): AddTemplateDataDemoAction {
  return {
    type: ADD_TEMPLATE_DATA_DEMO,
    payload: {
      patternId,
      templateId,
    },
  };
}

interface RemoveTemplateDemoAction extends Action {
  type: typeof REMOVE_TEMPLATE_DEMO;
  payload: {
    patternId: string;
    templateId: string;
    demoId: string;
  };
}

export function removeTemplateDemo({
  patternId,
  templateId,
  demoId,
}: {
  patternId: string;
  templateId: string;
  demoId: string;
}): RemoveTemplateDemoAction {
  return {
    type: REMOVE_TEMPLATE_DEMO,
    payload: {
      patternId,
      templateId,
      demoId,
    },
  };
}

interface UpdatePatternAction extends Action {
  type: typeof UPDATE_PATTERN;
  payload: KnapsackPattern;
}

export function updatePattern(pattern: KnapsackPattern): UpdatePatternAction {
  return {
    type: UPDATE_PATTERN,
    payload: pattern,
  };
}

interface UpdatePatternInfoAction extends Action {
  type: typeof UPDATE_PATTERN_INFO;
  payload: Partial<KnapsackPattern>;
}

interface UpdateTemplateInfoAction extends Action {
  type: typeof UPDATE_TEMPLATE_INFO;
  payload: {
    patternId: string;
    templateId: string;
    template: Partial<KnapsackPatternTemplate>;
  };
}

/**
 * Update basic Pattern Info
 * Basically everything besides `templates`
 */
export function updatePatternInfo(
  patternId: string,
  pattern: Partial<KnapsackPattern>,
): UpdatePatternInfoAction {
  return {
    type: UPDATE_PATTERN_INFO,
    payload: {
      id: patternId,
      ...pattern,
    },
  };
}

/**
 * Update basic Template Info
 */
export function updateTemplateInfo({
  patternId,
  templateId,
  template,
}: {
  patternId: string;
  templateId: string;
  template: Partial<KnapsackPatternTemplate>;
}): UpdateTemplateInfoAction {
  return {
    type: UPDATE_TEMPLATE_INFO,
    payload: {
      patternId,
      templateId,
      template,
    },
  };
}

type Actions =
  | UpdatePatternAction
  | UpdatePatternInfoAction
  | UpdateTemplateInfoAction
  | UpdateTemplateDemoAction
  | AddTemplateDataDemoAction
  | UpdatePatternSlicesAction
  | RemoveTemplateDemoAction;

export default function reducer(
  state = initialState,
  action: Actions,
): PatternsState {
  switch (action.type) {
    case UPDATE_PATTERN:
      return produce(state, draft => {
        draft.patterns[action.payload.id] = action.payload;
      });

    case UPDATE_PATTERN_INFO:
      return produce(state, draft => {
        const pattern = state.patterns[action.payload.id];
        draft.patterns[action.payload.id] = {
          ...pattern,
          ...action.payload,
          // can't change the below
          templates: pattern.templates,
          id: pattern.id,
        };
      });

    case UPDATE_TEMPLATE_INFO:
      return produce(state, draft => {
        const { patternId, templateId, template } = action.payload;
        const { templates } = draft.patterns[patternId];
        const oldTemplate = templates.find(t => t.id === templateId);
        Object.assign(oldTemplate, template);
      });

    case UPDATE_TEMPLATE_DEMO:
      return produce(state, draft => {
        const { templateId, patternId, demo } = action.payload;
        const pattern = draft.patterns[patternId];
        const template = pattern.templates.find(t => t.id === templateId);
        template.demosById[demo.id] = demo;
      });

    case ADD_TEMPLATE_DATA_DEMO:
      return produce(state, draft => {
        const { templateId, patternId } = action.payload;
        const pattern = draft.patterns[patternId];
        const template = pattern.templates.find(t => t.id === templateId);
        const id = shortid.generate();
        template.demosById[id] = {
          id,
          title: 'My New Demo',
          description: 'A description',
          type: 'data',
          data: {
            props: {},
            slots: {},
          },
        };
        template.demos.push(id);
      });

    case REMOVE_TEMPLATE_DEMO:
      return produce(state, draft => {
        const { templateId, patternId, demoId } = action.payload;
        const pattern = draft.patterns[patternId];
        const template = pattern.templates.find(t => t.id === templateId);
        delete template.demosById[demoId];
        template.demos = template.demos.filter(d => d !== demoId);
        // @todo search all other pattern demos to find any slots that used this demo.
      });

    case UPDATE_PATTERN_SLICES:
      return produce(state, draft => {
        const { patternId, slices } = action.payload;
        const pattern = draft.patterns[patternId];
        pattern.slices = slices;
      });
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
