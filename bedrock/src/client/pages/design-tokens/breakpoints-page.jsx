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
import React from 'react';
import BreakpointsDemo from '@basalt/bedrock-breakpoints-demo';
import { connectToContext } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import PageWithSidebar from '../../layouts/page-with-sidebar';

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
            if (error) return <p>Error</p>;
            this.setState({ breakpoints: data.tokens });
            return null;
          }}
        </Query>
      );
    }
    return (
      <PageWithSidebar {...this.props} className="docs">
        <h4 className="eyebrow">Visual Language</h4>
        <h2>Breakpoints</h2>
        <BreakpointsDemo breakpoints={this.state.breakpoints} />
        <br />
        {/* <ApiDemo */}
        {/* title="Breakpoints API" */}
        {/* endpoint={this.apiEndpoint} */}
        {/* requestType="get" */}
        {/* /> */}
      </PageWithSidebar>
    );
  }
}

// BreakpointsPage.propTypes = {
//   context: contextPropTypes.isRequired,
// };

export default connectToContext(BreakpointsPage);
