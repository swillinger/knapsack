import { ReactNode } from 'react';
import { KnapsackCustomPageSlice } from '../../../../schemas/custom-pages';

export type SliceRenderParams<T> = {
  data: T;
  canEdit: boolean;
  setSliceData: (data: T) => void;
  /**
   * Passing in a new key will trigger a full un-mount & re-mount of the React Component
   */
  key?: string;
};

export interface Slice<T> {
  id: string;
  title: string;
  description?: string;
  render: (opt: SliceRenderParams<T>) => ReactNode;
  renderEditForm?: (opt: SliceRenderParams<T>) => ReactNode;
  schema?: object;
  data?: object;
  uiSchema?: object;
  initialData?: T;
}
