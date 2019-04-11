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
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { plugins } from '@basalt/knapsack-core';
import Spinner from '@basalt/knapsack-spinner';
import 'react-table/react-table.css';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { StatusMessage, Button } from '@basalt/knapsack-atoms';
import { gqlToString } from '../../data';
import { BASE_PATHS } from '../../../lib/constants';
import PageWithSidebar from '../../layouts/page-with-sidebar';

const query = gql`
  query DesignTokenGroupPage($id: String) {
    tokenGroup(group: $id) {
      id
      title
      tokenCategories {
        id
        name
        tokens {
          name
          value
          category
          comment
          originalValue
          type
        }
      }
    }
  }
`;

function DesignTokenGroup(props) {
  return (
    <Query query={query} variables={{ id: props.id }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }
        if (error) {
          return <StatusMessage message={error.message} type="error" />;
        }
        const { tokenGroup } = data;

        return (
          <PageWithSidebar {...props} className="design-token-group">
            <div>
              <h4 className="eyebrow">Design Tokens</h4>
              <header
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h2>{tokenGroup.title}</h2>
                <Button>
                  <Link
                    to={`${
                      BASE_PATHS.GRAPHIQL_PLAYGROUND
                    }?${queryString.stringify({
                      query: gqlToString(query),
                      variables: JSON.stringify({
                        id: props.id,
                      }),
                    })}`}
                  >
                    See API
                  </Link>
                </Button>
              </header>
              <div>
                {tokenGroup.tokenCategories.map(category => {
                  let Demo = () => <p>no demo...</p>;
                  const designTokenCategoryDemo =
                    plugins.designTokenCategoryDemos[category.id];
                  if (designTokenCategoryDemo) {
                    Demo = designTokenCategoryDemo.render;
                  }
                  return <Demo tokens={category.tokens} key={category.id} />;
                })}
              </div>
            </div>
          </PageWithSidebar>
        );
      }}
    </Query>
  );
}

DesignTokenGroup.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DesignTokenGroup;
