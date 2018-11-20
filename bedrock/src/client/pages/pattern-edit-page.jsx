import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import SchemaForm from '@basalt/bedrock-schema-form';
import { StatusMessage } from '@basalt/bedrock-atoms';
import Spinner from '@basalt/bedrock-spinner';
import urlJoin from 'url-join';
import patternMetaSchema from '../../schemas/pattern-meta.schema';
import { apiUrlBase } from '../data';
import PageWithSidebar from '../layouts/page-with-sidebar';

const patternIdsQuery = gql`
  {
    patterns {
      id
      meta {
        title
        description
        type
        status
        uses
        demoSize
        hasIcon
        dosAndDonts {
          title
          description
          items {
            image
            caption
            do
          }
        }
      }
    }
  }
`;

class PatternEdit extends Component {
  constructor(props) {
    super(props);
    this.apiEndpoint = urlJoin(apiUrlBase, 'pattern-meta', props.id);
    // const pattern = props.context.patterns.find(p => p.id === props.id);
    this.state = {
      statusMessage: '',
      statusType: 'info',
      redirectUrl: '',
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
          });
          // without this delay, the next page does not show the fresh data yet
          setTimeout(() => {
            this.setState({ redirectUrl: `/patterns/${this.props.id}` });
          }, 1000);
        } else {
          this.setState({
            statusMessage: results.message,
            statusType: 'error',
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
        <Query query={patternIdsQuery}>
          {({ error, loading, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error</p>;
            const formData = data.patterns.find(p => p.id === this.props.id);
            return (
              <SchemaForm
                schema={patternMetaSchema}
                formData={formData}
                hasSubmit
                onSubmit={this.handleSubmit}
              />
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
