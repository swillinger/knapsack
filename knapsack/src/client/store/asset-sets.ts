import produce from 'immer';
import { Action } from './types';

import {
  KnapsackAssetSetData,
  KnapsackAssetSetsConfig,
  KnapsackAssetSetsData,
} from '../../schemas/asset-sets';

type AssetSetState = KnapsackAssetSetsData;

const UPDATE = 'knapsack/asset-sets/UPDATE';
const ADD = 'knapsack/asset-sets/ADD';
const REMOVE = 'knapsack/asset-sets/REMOVE';

const initialState: AssetSetState = {};

interface UpdateAssetSetAction extends Action {
  type: typeof UPDATE;
  payload: KnapsackAssetSetData;
}

export function updateAssetSet(
  assetSet: KnapsackAssetSetData,
): UpdateAssetSetAction {
  return {
    type: UPDATE,
    payload: assetSet,
  };
}

interface AddAssetSetAction extends Action {
  type: typeof ADD;
  payload: KnapsackAssetSetData;
}

export function addAssetSet(assetSet: KnapsackAssetSetData): AddAssetSetAction {
  return {
    type: ADD,
    payload: assetSet,
  };
}

interface RemoveAssetSetAction extends Action {
  type: typeof REMOVE;
  payload: {
    id: string;
  };
}

export function removeAssetSet(id: string): RemoveAssetSetAction {
  return {
    type: REMOVE,
    payload: {
      id,
    },
  };
}

type Actions = RemoveAssetSetAction | AddAssetSetAction | UpdateAssetSetAction;

export default function(state = initialState, action: Actions): AssetSetState {
  switch (action.type) {
    case UPDATE:
      return produce(state, draft => {
        draft.allAssetSets[action.payload.id] = action.payload;
      });
    case REMOVE:
      return produce(state, draft => {
        // @todo remove anything that uses this
        delete draft.allAssetSets[action.payload.id];
      });
    case ADD:
      return produce(state, draft => {
        draft.allAssetSets[action.payload.id] = action.payload;
      });
    default:
      return state;
  }
}
