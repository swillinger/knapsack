import React, { Component } from 'react';
import Spinner from '@basalt/bedrock-spinner';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connectToContext } from '@basalt/bedrock-core';
import { getDesignTokensCategories } from '../../data';

class AllPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tokens: {},
    };
    // this.apiEndpoint = `${props.bedrockSettings.urls.apiUrlBase}`;
    // @todo set correctly
    this.apiEndpoint = '/api';
  }

  async componentDidMount() {
    window
      .fetch(`${this.apiEndpoint}/design-tokens`)
      .then(res => res.json())
      .then(designTokens => {
        /** @type {string[]} */
        const availableTokenCategories = designTokens.map(d => d.id);

        getDesignTokensCategories(availableTokenCategories)
          .then(tokens => {
            console.log('getDesignTokensCategories', { tokens });
            if (tokens.ok) {
              this.setState({
                tokens: tokens.data,
                ready: true,
              });
            }
          })
          .catch(error => {
            console.error('getDesignTokensCategories failed', error);
          });
      });
  }

  render() {
    if (!this.state.ready) {
      return <Spinner />;
    }

    const allTokens = [];

    Object.keys(this.state.tokens).forEach(category => {
      allTokens.push(...this.state.tokens[category]);
    });

    console.log({ allTokens });

    return (
      <div>
        <h4 className="eyebrow">Design Tokens</h4>
        <h2>All Tokens</h2>
        <ReactTable
          data={allTokens}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
            },
            {
              Header: 'Value',
              accessor: 'value',
            },
            {
              Header: 'Category',
              accessor: 'category',
            },
            {
              Header: 'Original Value',
              accessor: 'originalValue',
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
          ]}
          showPagination={false}
          defaultPageSize={allTokens.length}
          filterable
        />
      </div>
    );
  }
}

// AllPage.propTypes = {
//   context: contextPropTypes.isRequired,
// };

export default connectToContext(AllPage);
