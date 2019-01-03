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
    patternTypes {
      id
      title
    }
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
    if (this.context.permissions.includes('write')) {
      // redirect to full page using a full reload so we don't need to worry about cached queries (like in the secondary nav)
      // @todo @joe fix this so a page reload is not required
      window.location.pathname = urlJoin(BASE_PATHS.PATTERN, this.props.id);
    }
  }

  render() {
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
                  // Need to dynamically add the pattern types to the schema form
                  Object.assign(patternMetaSchema.properties.type, {
                    enum: data.patternTypes.map(p => p.id),
                    enumNames: data.patternTypes.map(p => p.title),
                    default: data.patternTypes.map(p => p.id)[0],
                  });
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
                          if (!this.context.permissions.includes('write')) {
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
