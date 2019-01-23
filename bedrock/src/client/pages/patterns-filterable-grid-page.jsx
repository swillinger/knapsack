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
import Spinner from '@basalt/bedrock-spinner';
import SchemaForm from '@basalt/bedrock-schema-form';
import { uniqueArray } from '@basalt/bedrock-utils';
import { connectToContext } from '@basalt/bedrock-core';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Button } from '@basalt/bedrock-atoms';
import PatternGrid from '../components/pattern-grid';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { BASE_PATHS } from '../../lib/constants';
import { gqlToString, gqlQuery } from '../data';

const query = gql`
  {
    patternTypes {
      id
      title
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
    patternStatuses {
      id
      title
      color
    }
  }
`;

class PatternsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: [],
      patternTypes: [],
      patternStatuses: [],
      formData: {},
      ready: false,
    };
  }

  componentDidMount() {
    gqlQuery({
      gqlQueryObj: query,
    })
      .then(
        ({
          data: { patternTypes = [], patterns = [], patternStatuses = [] },
        }) => {
          const type = patternTypes.find(p => p.id === this.props.type);
          if (!type && this.props.type !== 'all') {
            this.props.history.push(`${BASE_PATHS.PATTERNS}/all`);
          }

          this.setState({
            ready: true,
            patterns,
            patternTypes,
            patternStatuses,
            formData: {
              type: type ? type.id : 'all',
            },
          });
        },
      )
      .catch(console.log.bind(console));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.setState({
        formData: {
          type: nextProps.type,
        },
      });
    }
  }

  render() {
    if (!this.state.ready) return <Spinner />;
    const { formData, patterns } = this.state;

    const filterSchema = {
      $schema: 'http://json-schema.org/draft-07/schema',
      type: 'object',
      properties: {},
    };

    const type = {
      type: 'string',
      title: 'Type',
      enum: ['all', ...this.state.patternTypes.map(p => p.id)],
      enumNames: ['All', ...this.state.patternTypes.map(p => p.title)],
      default: 'all',
    };

    // Needs to be more than `all, components`
    if (type.enum.length > 2) {
      filterSchema.properties.type = type;
    }

    const status = {
      type: 'string',
      title: 'Status',
      enum: uniqueArray(patterns.map(pattern => pattern.meta.status)),
    };

    if (status.enum.length > 1) {
      filterSchema.properties.status = status;
    }

    let visiblePatterns = this.state.patterns;
    if (formData.status) {
      visiblePatterns = visiblePatterns.filter(
        p => p.meta.status === formData.status,
      );
    }

    if (formData.type && formData.type !== 'all') {
      visiblePatterns = visiblePatterns.filter(
        p => p.meta.type === formData.type,
      );
    }

    const typeTitle =
      formData.type === 'all'
        ? 'All'
        : this.state.patternTypes.find(p => p.id === formData.type).title;

    return (
      <PageWithSidebar {...this.props} className="patterns-filters">
        <h4 className="eyebrow" style={{ textTransform: 'capitalize' }}>
          {typeTitle}
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
          schema={filterSchema}
          formData={this.state.formData}
          onChange={({ formData: newFormData }) => {
            if (newFormData.type !== this.state.formData.type) {
              this.props.history.push(
                `${BASE_PATHS.PATTERNS}/${newFormData.type}`,
              );
            }
            this.setState({ formData: newFormData });
          }}
          isInline
        />
        <PatternGrid
          patterns={visiblePatterns}
          patternStatuses={this.state.patternStatuses}
        />
      </PageWithSidebar>
    );
  }
}

PatternsPage.propTypes = {
  type: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connectToContext(PatternsPage);
