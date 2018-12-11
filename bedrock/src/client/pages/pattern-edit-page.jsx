import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import SchemaForm from '@basalt/bedrock-schema-form';
import { StatusMessage } from '@basalt/bedrock-atoms';
import Spinner from '@basalt/bedrock-spinner';
import { BedrockContext } from '@basalt/bedrock-core';
import urlJoin from 'url-join';
import patternMetaSchema from '../../schemas/pattern-meta.schema';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { BASE_PATHS } from '../../lib/constants';

const patternIdsQuery = gql`
  query PatternEditMeta($id: ID) {
    pattern(id: $id) {
      id
      meta {
        title
        description
        type
        status
        uses
        demoSize
        hasIcon
      }
    }
  }
`;

const patternMetaMutation = gql`
  mutation SetPatternMeta($id: ID, $meta: JSON) {
    setPatternMeta(id: $id, meta: $meta)
  }
`;

class PatternEdit extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      statusMessage: '',
    };
    this.updatePatternMetaRedirect = this.updatePatternMetaRedirect.bind(this);
  }

  updatePatternMetaRedirect() {
    if (this.context.features.enableUiSettings) {
      // redirect to full page using a full reload so we don't need to worry about cached queries (like in the secondary nav)
      // @todo @joe fix this so a page reload is not required
      window.location.pathname = urlJoin(BASE_PATHS.PATTERNS, this.props.id);
    }
  }

  render() {
    const { enableUiSettings } = this.context.features;
    return (
      <PageWithSidebar {...this.props}>
        <Query query={patternIdsQuery} variables={{ id: this.props.id }}>
          {({ error: queryError, loading, data }) => {
            if (loading) return <Spinner />;
            if (queryError)
              return (
                <StatusMessage message={queryError.message} type="error" />
              );
            return (
              <Mutation
                mutation={patternMetaMutation}
                ignoreResults
                onCompleted={() => this.updatePatternMetaRedirect()}
              >
                {(setPatternMeta, { error: mutationError }) => {
                  if (mutationError)
                    return (
                      <StatusMessage
                        message={mutationError.message}
                        type="error"
                      />
                    );
                  return (
                    <>
                      {this.state.statusMessage && (
                        <StatusMessage
                          message={this.state.statusMessage}
                          type="error"
                        />
                      )}
                      <SchemaForm
                        schema={patternMetaSchema}
                        formData={data.pattern.meta}
                        hasSubmit
                        onSubmit={async ({ formData }) => {
                          if (!enableUiSettings) {
                            this.setState({
                              statusMessage:
                                'Editing pattern meta has been disabled on this site.',
                            });
                            setTimeout(() => {
                              this.setState({
                                statusMessage: '',
                              });
                            }, 3000);
                          } else {
                            await setPatternMeta({
                              variables: {
                                id: this.props.id,
                                meta: formData,
                              },
                            });
                          }
                        }}
                      />
                    </>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
      </PageWithSidebar>
    );
  }
}

PatternEdit.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PatternEdit;
