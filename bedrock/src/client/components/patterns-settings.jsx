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
import gql from 'graphql-tag';
import { BedrockContext } from '@basalt/bedrock-core';
import { gqlQuery } from '../data';

const query = gql`
  {
    patternSettings {
      patternTypes {
        id
        title
      }
      patternStatuses {
        id
        title
        color
      }
    }
  }
`;

const SET_PATTERN_SETTINGS = gql`
  mutation setPatternSettings($settings: JSON) {
    setPatternSettings(settings: $settings) {
      patternTypes {
        id
        title
      }
      patternStatuses {
        id
        title
        color
      }
    }
  }
`;

const schema = {
  type: 'object',
  properties: {
    patternTypes: {
      type: 'array',
      title: 'Pattern Types',
      items: {
        type: 'object',
        required: ['id', 'title'],
        properties: {
          id: {
            type: 'string',
            title: 'ID',
          },
          title: {
            type: 'string',
            title: 'Title',
          },
        },
      },
    },
    patternStatuses: {
      type: 'array',
      title: 'Pattern Statuses',
      items: {
        type: 'object',
        required: ['id', 'title'],
        properties: {
          id: {
            type: 'string',
            title: 'ID',
          },
          title: {
            type: 'string',
            title: 'Title',
          },
          color: {
            type: 'string',
            title: 'Color',
            default: '#ccc',
          },
        },
      },
    },
  },
};

class PatternSettings extends Component {
  static contextType = BedrockContext;

  constructor(props) {
    super(props);
    this.state = {
      patternSettings: {
        patternStatuses: [],
        patternTypes: [],
      },
      ready: false,
    };
  }

  componentDidMount() {
    gqlQuery({
      gqlQueryObj: query,
    })
      .then(({ data }) => {
        this.setState({
          patternSettings: data.patternSettings,
          ready: true,
        });
      })
      .catch(console.log.bind(console));
  }

  render() {
    if (!this.context.permissions.includes('write')) {
      return <p>Editing currently disabled</p>;
    }
    if (!this.state.ready) return null;
    return (
      <SchemaForm
        schema={schema}
        formData={this.state.patternSettings}
        hasSubmit
        onSubmit={async ({ formData }) => {
          gqlQuery({
            gqlQueryObj: SET_PATTERN_SETTINGS,
            variables: {
              settings: formData,
            },
          })
            .then(() => {
              window.location.reload();
            })
            .catch(console.log.bind(console));
        }}
      />
    );
  }
}

export default PatternSettings;
