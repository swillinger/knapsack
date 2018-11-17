import React from 'react';
// import ApiDemo from '@basalt/bedrock-api-demo';
import BreakpointsDemo from '@basalt/bedrock-breakpoints-demo';
import { connectToContext } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';

const query = gql`
  query Breakpoints($category: String) {
    tokens(category: $category) {
      category
      name
      originalValue
      type
      value
      comment
    }
  }
`;

class BreakpointsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakpoints: null,
    };
  }

  render() {
    if (!this.state.breakpoints) {
      return (
        <Query query={query} variables={{ category: 'media-queries' }}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :(</p>;
            this.setState({ breakpoints: data.tokens });
            return null;
          }}
        </Query>
      );
    }
    return (
      <div className="docs">
        <h4 className="eyebrow">Visual Language</h4>
        <h2>Breakpoints</h2>
        <BreakpointsDemo breakpoints={this.state.breakpoints} />
        <br />
        {/* <ApiDemo */}
        {/* title="Breakpoints API" */}
        {/* endpoint={this.apiEndpoint} */}
        {/* requestType="get" */}
        {/* /> */}
      </div>
    );
  }
}

// BreakpointsPage.propTypes = {
//   context: contextPropTypes.isRequired,
// };

export default connectToContext(BreakpointsPage);
