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
import queryString from 'query-string';
import PageWithSidebar from '../layouts/page-with-sidebar';
import GraphiQl from '../components/graphiql';
import { BASE_PATHS } from '../../lib/constants';
import { gqlQuery } from '../data';

class GraphiqlPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: null,
      variables: null,
      ready: false,
      response: '',
    };
  }

  async componentDidMount() {
    const { query, variables } = queryString.parse(window.location.search);
    if (query) {
      const response = JSON.stringify(
        await gqlQuery({ query, variables }),
        null,
        '  ',
      );
      this.setState({
        query,
        variables: variables
          ? JSON.stringify(JSON.parse(variables), null, '  ')
          : '',
        response,
        ready: true,
      });
    } else {
      this.setState({ ready: true });
    }
  }

  render() {
    if (!this.state.ready) return null;
    const { query, variables, response } = this.state;
    return (
      <PageWithSidebar location={this.props.location}>
        <GraphiQl
          initialResponse={response}
          initialVariables={variables}
          initialQuery={query}
        />
      </PageWithSidebar>
    );
  }
}

GraphiqlPage.defaultProps = {
  location: BASE_PATHS.GRAPHIQL_PLAYGROUND,
};

GraphiqlPage.propTypes = {
  location: PropTypes.object,
};

export default GraphiqlPage;
