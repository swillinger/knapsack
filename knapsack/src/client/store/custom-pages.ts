import produce from 'immer';
import { Action } from './types';
import {
  KnapsackCustomPage,
  KnapsackCustomPagesData,
  KnapsackCustomSection,
} from '../../schemas/custom-pages';

const UPDATE_PAGE_TITLE = 'knapsack/custom-pages/UPDATE_PAGE_TITLE';
const UPDATE_PAGE = 'knapsack/custom-pages/UPDATE_PAGE';
const UPDATE_SECTIONS = 'knapsack/custom-pages/UPDATE_SECTIONS';

const initialState: KnapsackCustomPagesData = {
  pages: [],
  sections: [],
};

interface UpdatePageAction extends Action {
  type: typeof UPDATE_PAGE;
  payload: KnapsackCustomPage;
}

interface UpdatePageTitleAction extends Action {
  type: typeof UPDATE_PAGE_TITLE;
  payload: {
    // @todo how do I say this isn't just a string, but an id?
    sectionId: string;
    pageId: string;
    title: string;
  };
}

interface UpdateSectionsAction extends Action {
  type: typeof UPDATE_SECTIONS;
  payload: KnapsackCustomSection[];
}

export function updateCustomPage(page: KnapsackCustomPage): UpdatePageAction {
  return {
    type: UPDATE_PAGE,
    payload: page,
  };
}

export function updateCustomPageTitle({
  sectionId,
  pageId,
  title,
}): UpdatePageTitleAction {
  return {
    type: UPDATE_PAGE_TITLE,
    payload: {
      sectionId,
      pageId,
      title,
    },
  };
}

export function updateCustomSections(
  sections: KnapsackCustomSection[],
): UpdateSectionsAction {
  return {
    type: UPDATE_SECTIONS,
    payload: sections,
  };
}

type Actions = UpdatePageAction | UpdateSectionsAction | UpdatePageTitleAction;

export default function(
  state = initialState,
  action: Actions,
): KnapsackCustomPagesData {
  switch (action.type) {
    case UPDATE_PAGE:
      return produce(state, draft => {
        draft.pages = draft.pages.map(page => {
          if (page.path !== action.payload.path) return page;
          return action.payload;
        });
      });
    case UPDATE_SECTIONS:
      return produce(state, draft => {
        draft.sections = action.payload;
      });
    case UPDATE_PAGE_TITLE:
      return produce(state, draft => {
        let ok = false;
        draft.sections.forEach(section => {
          if (section.id === action.payload.sectionId) {
            section.pages.forEach(page => {
              if (page.id === action.payload.pageId) {
                page.title = action.payload.title;
                ok = true;
              }
            });
          }
        });
        if (!ok) {
          console.error(
            `Running Redux reducer on ${UPDATE_PAGE_TITLE} and could not find data needed to update`,
            action,
          );
          // @todo is this the right thing to di?
          throw new Error(
            `Custom page "${action.payload.pageId}" in section ${action.payload.sectionId} not found.`,
          );
        }
      });
    default:
      return state;
  }
}
