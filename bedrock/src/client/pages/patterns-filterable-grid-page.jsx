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
import Spinner from '@basalt/bedrock-spinner';
import SchemaForm from '@basalt/bedrock-schema-form';
import { uniqueArray } from '@basalt/bedrock-utils';
import { connectToContext } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Button } from '@basalt/bedrock-atoms';
import PatternGrid from '../components/pattern-grid';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { BASE_PATHS } from '../../lib/constants';
import { gqlToString } from '../data';

const query = gql`
  query($id: ID) {
    patternType(id: $id) {
      id
      title
      patterns {
        id
        meta {
          title
          description
        }
      }
    }
    patterns {
      id
      meta {
        title
        description
        type
        status
        hasIcon
      }
    }
  }
`;

class PatternsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: [],
      filterSchema: {},
      formData: {},
    };
  }

  render() {
    if (!this.state.patterns.length) {
      return (
        <Query query={query} variables={{ id: this.props.type }}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :(</p>;

            const thePatterns =
              this.props.type === 'all'
                ? data.patterns
                : data.patternType.patterns;

            const filterSchema = {
              $schema: 'http://json-schema.org/draft-07/schema',
              type: 'object',
              properties: {},
            };

            const status = {
              type: 'string',
              title: 'Status',
              enum: uniqueArray(
                thePatterns.map(pattern => pattern.meta.status),
              ),
            };

            if (status.enum.length > 1) {
              filterSchema.properties.status = status;
            }

            this.setState({
              patterns: thePatterns,
              typeTitle:
                this.props.type === 'all' ? 'All' : data.patternType.title,
              filterSchema,
            });
            return null;
          }}
        </Query>
      );
    }

    const { status } = this.state.formData;

    let visiblePatterns = this.state.patterns;
    if (status) {
      visiblePatterns = visiblePatterns.filter(p => p.meta.status === status);
    }

    return (
      <PageWithSidebar {...this.props} className="patterns-filters">
        <h4 className="eyebrow" style={{ textTransform: 'capitalize' }}>
          {this.state.typeTitle}
        </h4>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h2>Patterns</h2>
          <Button>
            <Link
              to={`${BASE_PATHS.GRAPHIQL_PLAYGROUND}?${queryString.stringify({
                query: gqlToString(query),
              })}`}
            >
              See API
            </Link>
          </Button>
        </header>
        <SchemaForm
          schema={this.state.filterSchema}
          formData={this.state.formData}
          onChange={({ formData }) => this.setState({ formData })}
          isInline
        />
        <PatternGrid patterns={visiblePatterns} />
      </PageWithSidebar>
    );
  }
}

export default connectToContext(PatternsPage);
