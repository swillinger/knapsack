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
