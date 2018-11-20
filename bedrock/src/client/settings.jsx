import React from 'react';
import PropTypes from 'prop-types';
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
      #      parentBrand {
      #        logo
      #        title
      #        homepage
      #      }
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

const SettingsMutation = props => (
  <Mutation mutation={SET_SETTINGS} variables={{ settings: props.settings }}>
    {(setSettings, { error }) => (
      <>
        {error && <StatusMessage message={error.message} type="error " />}
        <SchemaForm
          schema={bedrockSettingsSchema}
          formData={props.settings}
          onSubmit={
            ({ formData }) =>
              setSettings({
                variables: {
                  settings: formData,
                },
              })
            // ({ formData }) => console.log({ formData })
          }
          hasSubmit
        />
      </>
    )}
  </Mutation>
);

SettingsMutation.propTypes = {
  settings: PropTypes.object.isRequired, // eslint-disable-line
};

const SettingsPage = props => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <Spinner />;
      if (error) return <StatusMessage message={error.message} type="error " />;

      const { settings } = data;
      console.log(settings);
      return (
        <div>
          <h4 className="eyebrow">Configuration</h4>
          <h2>Settings</h2>
          {(props.context.features.enableUiSettings && (
            <>
              <hr />
              <br />
              <h3>
                <b style={{ color: 'red' }}>Warning</b>
              </h3>
              <p>
                Editing the site settings, especially those related to source
                directories and server configuration, may cause this site to
                break. This feature is intended for development mode only.
              </p>
              <br />
              <hr />
              <SettingsMutation settings={settings} />
            </>
          )) || (
            <>
              <h5>Oops ¯\_(ツ)_/¯</h5>
              <p>
                Seems you have reached this page in error. <br /> Adjusting site
                wide settings is a feature of Dev Mode. <br /> To enable,
                install the site locally and run `y start`.
              </p>
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
