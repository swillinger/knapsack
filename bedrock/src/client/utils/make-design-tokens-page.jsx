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
