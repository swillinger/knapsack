import React from 'react';
import SchemaForm from '@basalt/bedrock-schema-form';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';
import bedrockSettingsSchema from '../schemas/bedrock.settings.schema.json';

const query = gql`
  {
    settings {
      title
      subtitle
      slogan
      parentBrand {
        logo
        title
        homepage
      }
    }
  }
`;

const SET_SETTINGS = gql`
  mutation setSettings($settings: JSON) {
    setSettings(settings: $settings) {
      title
      subtitle
      slogan
      parentBrand {
        logo
        title
        homepage
      }
    }
  }
`;

const SettingsPage = props => (
  <Query query={query}>
    {({ loading, error: queryError, data, refetch }) => {
      if (loading) return <Spinner />;
      if (queryError)
        return <StatusMessage message={queryError.message} type="error " />;

      const { settings } = data;
      return (
        <div>
          <h4 className="eyebrow">Configuration</h4>
          <h2>Settings</h2>
          {(props.context.features.enableUiSettings && (
            <>
              <Mutation mutation={SET_SETTINGS} variables={{ settings }}>
                {(setSettings, { error }) => (
                  <>
                    {error && (
                      <StatusMessage message={error.message} type="error " />
                    )}
                    <SchemaForm
                      schema={bedrockSettingsSchema}
                      formData={settings}
                      onSubmit={({ formData }) => {
                        setSettings({
                          variables: {
                            settings: formData,
                          },
                        });
                        refetch();
                      }}
                      hasSubmit
                    />
                  </>
                )}
              </Mutation>
            </>
          )) || (
            <>
              <h5>Oops ¯\_(ツ)_/¯</h5>
              <p>Seems you have reached this page in error.</p>
            </>
          )}
        </div>
      );
    }}
  </Query>
);

SettingsPage.propTypes = {
  context: contextPropTypes.isRequired,
};

export default connectToContext(SettingsPage);
