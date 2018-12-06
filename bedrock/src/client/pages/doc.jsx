import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Spinner from '@basalt/bedrock-spinner';
import 'react-table/react-table.css';
import { Mutation, Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { StatusMessage, Button } from '@basalt/bedrock-atoms';
import MdBlock from '../components/md-block';
import { gqlToString } from '../data';
import { BASE_PATHS } from '../../lib/constants';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { enableUiSettings } from '../../lib/features';

const query = gql`
  query DocPage($id: ID!) {
    doc(id: $id) {
      id
      content
      data {
        title
      }
    }
  }
`;

const updateDoc = gql`
  mutation UpdateDoc($id: ID!, $content: String!) {
    setDoc(id: $id, content: $content) {
      content
    }
  }
`;

function DocPage(props) {
  return (
    <Query query={query} variables={{ id: props.id }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }
        if (error) {
          return <StatusMessage message={error.message} type="error" />;
        }

        const {
          content,
          data: { title },
        } = data.doc;
        return (
          <PageWithSidebar {...props} className="doc-group">
            <div>
              <h4 className="eyebrow">Docs</h4>
              <header
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h2>{title}</h2>
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
                <Mutation mutation={updateDoc} ignoreResults>
                  {setDoc => (
                    <MdBlock
                      md={content}
                      isEditable={enableUiSettings}
                      title={title}
                      handleSave={async newContent => {
                        await setDoc({
                          variables: {
                            id: props.id,
                            content: newContent,
                          },
                        });
                      }}
                    />
                  )}
                </Mutation>
              </div>
            </div>
          </PageWithSidebar>
        );
      }}
    </Query>
  );
}

DocPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DocPage;
