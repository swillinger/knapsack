import React from 'react';
import Spinner from '@basalt/bedrock-spinner';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import { plugins } from '@basalt/bedrock-core';
import { StatusMessage } from '@basalt/bedrock-atoms';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { TokenCategory } from '@basalt/bedrock-design-token-demos';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import { containsString } from '../../utils/string-helpers';

const query = gql`
  {
    tokens {
      value
      originalValue
      category
      name
      value
      comment
    }
  }
`;

/**
 * Matches values, both case insensitive and location insensitive
 * @param {Object} filter - column title as id and search term as value
 * @param {Object} row - each row in the table
 * @returns {boolean} - true if fuzzy match successful
 */
function basicFuzzyFilter(filter, row) {
  const id = filter.pivotId || filter.id;
  return row[id] !== undefined
    ? containsString(String(row[id]), filter.value)
    : true;
}

function AllPage(props) {
  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <Spinner />;
        if (error)
          return <StatusMessage message={error.message} type="error" />;
        return (
          <PageWithSidebar {...props}>
            <h4 className="eyebrow">Design Tokens</h4>
            <h2>All Tokens</h2>
            <ReactTable
              data={data.tokens}
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Value',
                  accessor: 'value',
                },
                {
                  Header: 'Category',
                  accessor: 'category',
                },
                {
                  Header: 'Original Value',
                  accessor: 'originalValue',
                },
                {
                  Header: 'Type',
                  accessor: 'type',
                },
              ]}
              showPagination={false}
              defaultPageSize={data.tokens.length}
              filterable
              defaultFilterMethod={basicFuzzyFilter}
            />

            {/* @todo consider setting this page up with tabs at top to show either table (above) or every single token (below) */}
            {/* {data.tokenCategories.map(category => { */}
            {/* let Demo = () => <p>no demo...</p>; */}
            {/* const designTokenCategoryDemo = */}
            {/* plugins.designTokenCategoryDemos[category.id]; */}
            {/* if (designTokenCategoryDemo) { */}
            {/* Demo = designTokenCategoryDemo.render; */}
            {/* } */}
            {/* return ( */}
            {/* <TokenCategory tokenCategory={category} key={category.id}> */}
            {/* <Demo tokens={category.tokens} /> */}
            {/* </TokenCategory> */}
            {/* ); */}
            {/* })} */}
          </PageWithSidebar>
        );
      }}
    </Query>
  );
}

export default AllPage;
