import { KnapsackCustomPageSlice } from '../../../../schemas/custom-pages';

export type SliceRenderParams<T> = {
  data: T;
  isEditing: boolean;
  setSliceData: (data: T) => void;
};

export interface Slice<T> {
  id: string;
  title: string;
  description?: string;
  render: ({
    data,
    isEditing,
    setSliceData,
  }: SliceRenderParams<T>) => import('react').ReactNode;
  schema?: object;
  data?: object;
  uiSchema?: object;
  initialData?: T;
}
