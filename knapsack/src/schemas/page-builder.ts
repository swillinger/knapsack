import gql from 'graphql-tag';

export interface PageBuilderSlice {
  id: string;
  patternId: string;
  data: Record<string, any>;
}

export interface PageBuilderPage {
  id: string;
  title: string;
  description: string;
  slices: PageBuilderSlice[];
}

export const pageBuilderPagesTypeDef = gql`
  scalar JSON

  type PageBuilderPageSlice {
    id: ID!
    patternId: ID!
    templateId: ID!
    data: JSON!
  }

  type PageBuilderPage {
    id: ID!
    title: String!
    description: String
    path: String!
    slices: [PageBuilderPageSlice]!
  }

  type Query {
    pageBuilderPage(id: ID): PageBuilderPage
    pageBuilderPages: [PageBuilderPage]
  }

  type Mutation {
    setPageBuilderPage(id: ID, data: JSON): PageBuilderPage
  }
`;
