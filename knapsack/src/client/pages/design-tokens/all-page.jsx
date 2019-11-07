/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import { Spinner, Button, StatusMessage } from '@knapsack/design-system';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import { plugins } from '@knapsack/core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { TokenCategory } from '@knapsack/design-token-demos';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import { containsString } from '../../utils/string-helpers';
import { BASE_PATHS } from '../../../lib/constants';
import { gqlToString } from '../../data';

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
 * @param {object} filter - column title as id and search term as value
 * @param {object} row - each row in the table
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
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <h2>All Tokens</h2>
              <Button>
                <Link
                  to={`${
                    BASE_PATHS.GRAPHIQL_PLAYGROUND
                  }?${queryString.stringify({
                    query: gqlToString(query),
                  })}`}
                >
                  See API
                </Link>
              </Button>
            </header>
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
