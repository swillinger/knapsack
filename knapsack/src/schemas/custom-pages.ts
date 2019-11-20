export interface KnapsackCustomPageSlice {
  id: string;
  /**
   * Match this to a Slices `id` to use it
   * @todo Change to `sliceType`
   */
  blockId: string;
  data: any;
}

export interface KnapsackCustomPage {
  id: string;
  title: string;
  slices?: KnapsackCustomPageSlice[];
}

export interface KnapsackCustomPagesData {
  pages?: {
    [id: string]: KnapsackCustomPage;
  };
}
