import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Details, Select } from '@basalt/bedrock-atoms';
import { TOKEN_FORMATS } from '@basalt/bedrock-design-token-demos/constants';

import { gqlQuery } from '../data';

const CategoryWrapper = styled.aside`
  margin-top: 4rem;
`;

const query = gql`
  query DesignTokenCategoryFormat($format: TokenFormats!, $category: String) {
    tokensInFormat(category: $category, format: $format)
  }
`;

const outputFormats = Object.keys(TOKEN_FORMATS).map(key => {
  const value = TOKEN_FORMATS[key];
  return {
    value: key,
    title: value,
  };
});

export default class TokenCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      format: outputFormats[0],
    };

    this.getFormat = this.getFormat.bind(this);
  }

  componentDidMount() {
    this.getFormat(outputFormats[0].value);
  }

  getFormat(format) {
    gqlQuery({
      gqlQueryObj: query,
      variables: {
        format,
        category: this.props.tokenCategory.id,
      },
    })
      .then(({ data }) => {
        this.setState({
          results: data.tokensInFormat,
          format,
        });
      })
      .catch(console.log.bind(console));
  }

  render() {
    const { tokenCategory, children } = this.props;
    return (
      <CategoryWrapper id={tokenCategory.id}>
        <h2>{tokenCategory.name}</h2>
        <div>{children}</div>
        <Details>
          <div style={{ padding: '10px 0 5px' }}>
            <Select
              items={outputFormats}
              handleChange={this.getFormat}
              label="Format"
            />
          </div>
          <pre>
            <code className={`lang-${this.state.format}`}>
              {this.state.results}
            </code>
          </pre>
        </Details>
      </CategoryWrapper>
    );
  }
}

TokenCategory.propTypes = {
  tokenCategory: {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }.isRequired,
  children: PropTypes.element.isRequired,
};
