import React, { ReactNode } from 'react';
import { KnapsackCustomPageSlice } from '../../../../schemas/custom-pages';

export type SliceRenderParams<DataType, StateType = {}> = {
  data: DataType;
  canEdit: boolean;
  setSliceData: (data: DataType) => void;
  state: Partial<StateType>;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
  /**
   * Passing in a new key will trigger a full un-mount & re-mount of the React Component
   */
  key?: string;
};

export interface Slice<DataType, StateType = {}> {
  id: string;
  title: string;
  description?: string;
  render: (opt: SliceRenderParams<DataType>) => ReactNode;
  renderEditForm?: (opt: SliceRenderParams<DataType>) => ReactNode;
  schema?: object;
  data?: object;
  uiSchema?: object;
  initialData?: DataType;
}
