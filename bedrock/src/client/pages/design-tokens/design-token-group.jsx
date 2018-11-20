import React from 'react';
import PropTypes from 'prop-types';
import { plugins } from '@basalt/bedrock-core';
import Spinner from '@basalt/bedrock-spinner';
import 'react-table/react-table.css';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { StatusMessage } from '@basalt/bedrock-atoms';
import { TokenCategory } from '@basalt/bedrock-design-token-demos';
import PageWithSidebar from '../../layouts/page-with-sidebar';

const query = gql`
  query OmniPage($id: String) {
    tokenGroup(group: $id) {
      id
      title
      tokenCategories {
        id
        name
        tokens {
          name
          value
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
              <h2>{tokenGroup.title}</h2>
              <div>
                {tokenGroup.tokenCategories.map(category => {
                  let Demo = () => <p>no demo...</p>;
                  const designTokenCategoryDemo =
                    plugins.designTokenCategoryDemos[category.id];
                  if (designTokenCategoryDemo) {
                    Demo = designTokenCategoryDemo.render;
                  }
                  return (
                    <TokenCategory tokenCategory={category} key={category.id}>
                      <Demo tokens={category.tokens} />
                    </TokenCategory>
                  );
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
