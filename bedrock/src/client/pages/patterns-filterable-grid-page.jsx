import React, { Component } from 'react';
import Spinner from '@basalt/bedrock-spinner';
import SchemaForm from '@basalt/bedrock-schema-form';
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

const filterSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Filters',
  type: 'object',
  properties: {
    uses: {
      title: 'Uses',
      type: 'object',
      properties: {
        inComponent: {
          title: 'In Component',
          type: 'boolean',
          description: 'Used in a component',
        },
        inSlice: {
          title: 'In Slice',
          type: 'boolean',
          description: 'Used in slices',
        },
        inGrid: {
          title: 'In Grid',
          type: 'boolean',
          description: 'Used in a grid',
        },
      },
    },
    statuses: {
      title: 'Statuses',
      type: 'object',
      properties: {
        ready: {
          title: 'Ready',
          type: 'boolean',
          description: 'Denotes that the component is ready and published',
        },
        draft: {
          title: 'Draft',
          type: 'boolean',
          description:
            'Denotes that the component is a draft, and not published',
        },
      },
    },
  },
};

const query = gql`
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

class PatternsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: null,
      visiblePatterns: [],
      formData: {
        statuses: {
          ready: true,
          draft: true,
        },
        uses: {
          inComponent: true,
          inGrid: true,
          inSlice: true,
        },
      },
    };
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.updateVisiblePatterns = this.updateVisiblePatterns.bind(this);
  }

  updateVisiblePatterns() {
    const { patterns } = this.state;

    const visibleItems = patterns
      .filter(item => {
        // Filters based on "status" param set within component index.js meta const declaration
        // ** Note: If you want to show in "Draft" filtered view, component meta must include --> status: 'draft'
        // ** otherwise "ready" status will be assumed
        const visibleStatuses = Object.keys(
          this.state.formData.statuses,
        ).filter(key => this.state.formData.statuses[key]);
        return visibleStatuses.some(status => item.meta.status === status);
      })
      .filter(item => {
        // Filters based on "uses" param set within component index.js meta const declaration
        // ** Note: You MUST set at least one value for component to show within the pattern grid
        const visibleUses = Object.keys(this.state.formData.uses).filter(
          key => this.state.formData.uses[key],
        );
        return item.meta.uses.some(use => visibleUses.includes(use));
      });

    this.setState({
      visiblePatterns: visibleItems,
    });
  }

  handleChangeForm({ formData }) {
    this.setState({
      formData,
    });
    this.updateVisiblePatterns();
  }

  render() {
    if (!this.state.patterns) {
      return (
        <Query query={query}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :(</p>;
            this.setState({
              patterns: data.patterns,
              visiblePatterns: data.patterns,
            });
            return null;
          }}
        </Query>
      );
    }

    return (
      <PageWithSidebar {...this.props} className="patterns-filters">
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
          onChange={this.handleChangeForm}
          isInline
        />
        <PatternGrid patterns={this.state.visiblePatterns} />
      </PageWithSidebar>
    );
  }
}

export default connectToContext(PatternsPage);
