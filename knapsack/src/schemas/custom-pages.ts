import gql from 'graphql-tag';

export interface KnapsackCustomPageSlice {
  id: string;
  blockId: string;
  data: Record<string, any>;
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
  id: string;
  title: string;
  showInMainMenu: boolean;
  pages: KnapsackCustomSectionPage[];
}

export const customPagesTypeDef = gql`
  scalar JSON

  type Slice {
    id: ID!
    blockId: String!
    data: JSON
  }

  type CustomPage {
    path: ID!
    slices: [Slice]
  }

  type Query {
    customPages: [CustomPage]
    customPage(path: ID): CustomPage
  }

  type Mutation {
    setCustomPage(path: ID, customPage: JSON): CustomPage
  }
`;
