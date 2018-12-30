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
import SchemaForm from '@basalt/bedrock-schema-form';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';
import { BedrockContext } from '@basalt/bedrock-core';
import bedrockSettingsSchema from '../../schemas/bedrock.settings.schema';
import PageWithSidebar from '../layouts/page-with-sidebar';
import PatternsSettings from '../components/patterns-settings';

// @todo implement parentbrand fully
const query = gql`
  {
    settingsAll
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

class SettingsPage extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      statusMessage: '',
      statusType: 'info',
    };
  }

  render() {
    return (
      <PageWithSidebar>
        <Query query={query}>
          {({ loading, error: queryError, data, refetch }) => {
            if (loading) return <Spinner />;
            if (queryError)
              return (
                <StatusMessage message={queryError.message} type="error " />
              );
            const { settingsAll: settings } = data;
            return (
              <div>
                <h4 className="eyebrow">Configuration</h4>
                <h2>Settings</h2>
                <Mutation mutation={SET_SETTINGS} variables={{ settings }}>
                  {(setSettings, { error }) => (
                    <>
                      {error && (
                        <StatusMessage message={error.message} type="error " />
                      )}
                      {this.state.statusMessage && (
                        <StatusMessage
                          message={this.state.statusMessage}
                          type={this.state.statusType}
                        />
                      )}
                      <SchemaForm
                        schema={bedrockSettingsSchema}
                        formData={settings}
                        onSubmit={({ formData }) => {
                          if (this.context.permissions.includes('write')) {
                            setSettings({
                              variables: {
                                settings: formData,
                              },
                            });
                            refetch();
                          } else {
                            this.setState({
                              statusMessage:
                                'Editing site settings has been disabled on this site.',
                              statusType: 'error',
                            });
                            setTimeout(() => {
                              this.setState({
                                statusMessage: '',
                                statusType: 'info',
                              });
                            }, 3000);
                          }
                        }}
                        hasSubmit
                      />
                    </>
                  )}
                </Mutation>
              </div>
            );
          }}
        </Query>
        <hr />
        <PatternsSettings />
      </PageWithSidebar>
    );
  }
}

export default SettingsPage;
