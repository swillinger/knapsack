import produce from 'immer';
import { Action } from './types';
import { KnapsackNavsConfig, KnapsackNavItem } from '../../schemas/nav';

const UPDATE_SECONDARY_NAV = 'knapsack/navs/UPDATE_SECONDARY_NAV';
const ADD_SECONDARY_NAV_ITEM = 'knapsack/navs/ADD_SECONDARY_NAV_ITEM';
// const UPDATE_PAGE = 'knapsack/custom-pages/UPDATE_PAGE';
// const UPDATE_SECTIONS = 'knapsack/custom-pages/UPDATE_SECTIONS';

const initialState: KnapsackNavsConfig = {
  primary: [],
  secondary: [],
};

interface UpdateSecondaryNav extends Action {
  type: typeof UPDATE_SECONDARY_NAV;
  payload: KnapsackNavItem[];
}

interface AddSecondaryNavItem extends Action {
  type: typeof ADD_SECONDARY_NAV_ITEM;
  payload: KnapsackNavItem;
}

export function updateSecondaryNav(
  navItems: KnapsackNavItem[],
): UpdateSecondaryNav {
  return {
    type: UPDATE_SECONDARY_NAV,
    payload: navItems,
  };
}

export function addSecondaryNavItem(
  navItem: KnapsackNavItem,
): AddSecondaryNavItem {
  return {
    type: ADD_SECONDARY_NAV_ITEM,
    payload: navItem,
  };
}

// interface UpdatePageTitleAction extends Action {
//   type: typeof UPDATE_PAGE_TITLE;
//   payload: {
//     // @todo how do I say this isn't just a string, but an id?
//     sectionId: string;
//     pageId: string;
//     title: string;
//   };
// }
//
// interface UpdateSectionsAction extends Action {
//   type: typeof UPDATE_SECTIONS;
//   payload: KnapsackCustomSection[];
// }
//
// export function updateCustomPage(page: KnapsackCustomPage): UpdatePageAction {
//   return {
//     type: UPDATE_PAGE,
//     payload: page,
//   };
// }
//
// export function updateCustomPageTitle({
//   sectionId,
//   pageId,
//   title,
// }): UpdatePageTitleAction {
//   return {
//     type: UPDATE_PAGE_TITLE,
//     payload: {
//       sectionId,
//       pageId,
//       title,
//     },
//   };
// }
//
// export function updateCustomSections(
//   sections: KnapsackCustomSection[],
// ): UpdateSectionsAction {
//   return {
//     type: UPDATE_SECTIONS,
//     payload: sections,
//   };
// }

export type Actions = UpdateSecondaryNav | AddSecondaryNavItem;

export default function(
  state = initialState,
  action: Actions,
): KnapsackNavsConfig {
  switch (action.type) {
    case UPDATE_SECONDARY_NAV:
      return produce(state, draft => {
        draft.secondary = action.payload;
      });

    case ADD_SECONDARY_NAV_ITEM:
      return produce(state, draft => {
        draft.secondary.push(action.payload);
      });
    default:
      return state;
  }
}
