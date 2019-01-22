/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';

export const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tokens: PropTypes.object.isRequired,
};

const query = gql`
  query TokenGroup($group: String) {
    tokenGroup(group: $group) {
      id
      description
      path
      title
      tokenCategories {
        id
        hasDemo
        name
        tokens {
          category
          comment
          name
          originalValue
          type
          value
        }
      }
    }
  }
`;

/**
 *
 * @param {React.SFC} WrappedComponent
 * @return {React.ComponentClass}
 */
export default function makeDesignTokensPage(WrappedComponent) {
  return class extends React.Component {
    static propTypes = {
      id: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        tokens: {},
        ready: false,
        errorMessage: '',
      };
    }

    render() {
      return (
        <Query query={query} variables={{ group: this.props.id }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <Spinner />;
            }
            if (error) {
              return <StatusMessage message={error.message} type="error" />;
            }
            const tokens = {};
            // @todo remove once group pages can use `data.tokenGroup`
            data.tokenGroup.tokenCategories.forEach(cat => {
              if (cat.hasDemo) {
                tokens[cat.id] = cat.tokens;
              }
            });
            return <WrappedComponent {...data.tokenGroup} tokens={tokens} />;
          }}
        </Query>
      );
    }
  };
}
