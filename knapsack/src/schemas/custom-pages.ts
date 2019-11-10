import gql from 'graphql-tag';

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
  path: string;
  slices: KnapsackCustomPageSlice[];
}

export interface KnapsackCustomSectionPage {
  id: string;
  title: string;
}

export interface KnapsackCustomSection {
  /**
   * Section ID
   */
  id: string;
  /**
   * Section Title
   */
  title: string;
  /**
   * Show in Main Menu
   * Will always show in Secondary Menu
   */
  showInMainMenu?: boolean;
  pages: KnapsackCustomSectionPage[];
}

export interface KnapsackCustomPagesData {
  sections?: KnapsackCustomSection[];
  pages?: KnapsackCustomPage[];
}
