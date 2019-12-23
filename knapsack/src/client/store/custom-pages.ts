import produce from 'immer';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import slugify from 'slugify';
import { generate as generateId } from 'shortid';
import { Action } from './types';
import {
  addSecondaryNavItem,
  deleteNavItem,
  Actions as NavActions,
} from './navs';
import {
  KnapsackCustomPage,
  KnapsackCustomPagesData,
} from '../../schemas/custom-pages';
import { BASE_PATHS } from '../../lib/constants';

const UPDATE_PAGE = 'knapsack/custom-pages/UPDATE_PAGE';
const ADD_PAGE = 'knapsack/custom-pages/ADD_PAGE';

const initialState: KnapsackCustomPagesData = {
  pages: {},
};

interface UpdatePageAction extends Action {
  type: typeof UPDATE_PAGE;
  payload: KnapsackCustomPage;
}

export function updateCustomPage(page: KnapsackCustomPage): UpdatePageAction {
  return {
    type: UPDATE_PAGE,
    payload: page,
  };
}

const DELETE_PAGE = 'knapsack/custom-pages/DELETE_PAGE';
interface DeletePageAction extends Action {
  type: typeof DELETE_PAGE;
  payload: {
    id: string;
  };
}
export function deletePage(
  payload: DeletePageAction['payload'],
): ThunkAction<void, AppState, {}, Actions | NavActions> {
  return (dispatch, getState) => {
    const navId = getState()?.navsState?.secondary?.find(
      navItem => navItem.path === `${BASE_PATHS.PAGES}/${payload.id}`,
    )?.id;
    const deletePageAction: DeletePageAction = {
      type: DELETE_PAGE,
      payload,
    };
    dispatch(deletePageAction);
    dispatch(
      deleteNavItem({
        id: navId,
        nav: 'secondary',
      }),
    );
  };
}

interface AddPage extends Action {
  type: typeof ADD_PAGE;
  payload: Pick<KnapsackCustomPage, 'id' | 'title'>;
}

type Actions = UpdatePageAction | AddPage | DeletePageAction;

type AppState = import('./index').AppState;

export function addPage(
  page: Pick<KnapsackCustomPage, 'title'>,
): ThunkAction<void, AppState, {}, Actions | NavActions> {
  return (dispatch, getState) => {
    const { pages } = getState().customPagesState;
    const potentialId = slugify(page.title.toLowerCase());
    const id = pages[potentialId]
      ? `${potentialId}-${generateId()}`
      : potentialId;
    const addPageAction: AddPage = {
      type: ADD_PAGE,
      payload: {
        id,
        title: page.title,
      },
    };
    dispatch(addPageAction);
    dispatch(
      addSecondaryNavItem({
        name: page.title,
        id,
        path: `${BASE_PATHS.PAGES}/${id}`,
        parentId: 'root',
      }),
    );
  };
}

export default function(
  state = initialState,
  action: Actions,
): KnapsackCustomPagesData {
  switch (action.type) {
    case ADD_PAGE:
      return produce(state, draft => {
        draft.pages[action.payload.id] = action.payload;
      });

    case UPDATE_PAGE:
      return produce(state, draft => {
        draft.pages[action.payload.id] = {
          ...state.pages[action.payload.id],
          ...action.payload,
        };
      });

    case DELETE_PAGE:
      return produce(state, draft => {
        delete draft.pages[action.payload.id];
      });

    default:
      return state;
  }
}
