import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import SchemaForm from '@basalt/bedrock-schema-form';
import { StatusMessage } from '@basalt/bedrock-atoms';
import Spinner from '@basalt/bedrock-spinner';
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

function PatternEdit(props) {
  return (
    <PageWithSidebar {...props}>
      <Query query={patternIdsQuery} variables={{ id: props.id }}>
        {({ error: queryError, loading, data }) => {
          if (loading) return <Spinner />;
          if (queryError)
            return <StatusMessage message={queryError.message} type="error" />;

          return (
            <Mutation
              mutation={patternMetaMutation}
              ignoreResults
              onCompleted={() => {
                // redirect to full page using a full reload so we don't need to worry about cached queries (like in the secondary nav)
                window.location.pathname = urlJoin(
                  BASE_PATHS.PATTERNS,
                  props.id,
                );
              }}
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
                  <SchemaForm
                    schema={patternMetaSchema}
                    formData={data.pattern.meta}
                    hasSubmit
                    onSubmit={async ({ formData }) => {
                      await setPatternMeta({
                        variables: {
                          id: props.id,
                          meta: formData,
                        },
                      });
                    }}
                  />
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    </PageWithSidebar>
  );
}

PatternEdit.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PatternEdit;
