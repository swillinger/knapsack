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
import { Redirect } from 'react-router-dom';
import { connectToContext } from '@basalt/bedrock-core';
import SchemaForm from '@basalt/bedrock-schema-form';
import { StatusMessage } from '@basalt/bedrock-atoms';
import urlJoin from 'url-join';
import patternMetaSchema from '../../schemas/pattern-meta.schema';
import { apiUrlBase } from '../data';
import PageWithSidebar from '../layouts/page-with-sidebar';

class PatternNew extends Component {
  constructor(props) {
    super(props);
    this.apiEndpoint = urlJoin(apiUrlBase, 'new-pattern');
    this.state = {
      statusMessage: '',
      statusType: 'info',
      redirectUrl: '',
      formData: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit({ formData }) {
    window
      .fetch(this.apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(results => {
        if (results.ok) {
          this.setState({
            statusMessage: `${results.message} Redirecting...`,
            statusType: 'success',
            formData,
          });

          // without this delay, the next page does not show the fresh data yet
          // can't use React Router link, b/c we need the whole React Context to start over so the system knows about the new pattern, so we use a full page change.
          setTimeout(() => {
            window.location = `/patterns/${formData.id}/edit`;
          }, 1000);
        } else {
          this.setState({
            statusMessage: results.message,
            statusType: 'error',
            formData,
          });
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.redirectUrl) {
      return <Redirect to={this.state.redirectUrl} />;
    }
    return (
      <PageWithSidebar {...this.props}>
        {this.state.statusMessage && (
          <StatusMessage
            message={this.state.statusMessage}
            type={this.state.statusType}
          />
        )}
        <SchemaForm
          schema={patternMetaSchema}
          formData={this.state.formData}
          hasSubmit
          onSubmit={this.handleSubmit}
        />
        <br />
        <StatusMessage
          message={`Warning: after you land on the brand new Overview page, you will see an error saying something like 'Template ... is not defined'

YOU MUST RESTART COMMAND LINE TOOLS AFTERWARDS

We're working on a better solution already; thanks you for your patience,
The Management
        `}
          type="warning"
        />
      </PageWithSidebar>
    );
  }
}

PatternNew.propTypes = {
  // context: contextPropTypes.isRequired,
};

export default connectToContext(PatternNew);
