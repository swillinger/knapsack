import produce from 'immer';
import slugify from 'slugify';
import { generate as generateId } from 'shortid';
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

type Navs = 'primary' | 'secondary';

interface UpdateSecondaryNav extends Action {
  type: typeof UPDATE_SECONDARY_NAV;
  payload: KnapsackNavItem[];
}

interface AddSecondaryNavItem extends Action {
  type: typeof ADD_SECONDARY_NAV_ITEM;
  payload: Partial<KnapsackNavItem>;
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
  navItem: Partial<KnapsackNavItem>,
): AddSecondaryNavItem {
  return {
    type: ADD_SECONDARY_NAV_ITEM,
    payload: navItem,
  };
}

const DELETE_NAV_ITEM = 'knapsack/navs/DELETE_NAV_ITEM';
interface DeleteNavItemAction extends Action {
  type: typeof DELETE_NAV_ITEM;
  payload: {
    id: string;
    nav: Navs;
  };
}
export function deleteNavItem(
  payload: DeleteNavItemAction['payload'],
): DeleteNavItemAction {
  return {
    type: DELETE_NAV_ITEM,
    payload,
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

export type Actions =
  | UpdateSecondaryNav
  | AddSecondaryNavItem
  | DeleteNavItemAction;

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
        const ids = draft.secondary.map(n => n.id);

        const newItem = action.payload;
        let { id } = newItem;
        if (!id && action.payload.name) {
          const potentialId = slugify(action.payload.name.toLowerCase());
          id = ids.includes(potentialId)
            ? `${potentialId}-${generateId()}`
            : potentialId;
        }
        draft.secondary.push({
          path: '',
          parentId: 'root',
          ...newItem,
          id,
        });
      });

    case DELETE_NAV_ITEM:
      return produce(state, draft => {
        const { id, nav } = action.payload;
        const { parentId } = draft[nav].find(item => item.id === id);
        draft[nav] = draft[nav]
          // delete item
          .filter(item => item.id !== id)
          // if it has any children, lift them up one level
          .map(item => {
            if (item.parentId !== id) return item;
            return {
              ...item,
              parentId,
            };
          });
      });
    default:
      return state;
  }
}
