import React from 'react';
import PropTypes from 'prop-types';
import GraphiQL from 'graphiql'; // https://www.npmjs.com/package/graphiql
import 'graphiql/graphiql.css';
import { gqlQuery } from '../data';

/**
 * Simply applies default graphql function
 * Instantiating this component with a 'fetcher' attribute will override the default
 * @param {Object} props - react props
 * @returns {*}
 * @constructor
 */
function GraphiQLBlock(props) {
  return (
    <GraphiQL
      fetcher={({ query, variables }) => gqlQuery({ query, variables })}
      query={props.initialQuery}
      variables={props.initialVariables}
      response={props.initialResponse}
    />
  );
}
GraphiQLBlock.defaultProps = {
  initialQuery: null,
  initialVariables: null,
  initialResponse: '',
};

GraphiQLBlock.propTypes = {
  initialQuery: PropTypes.string,
  initialVariables: PropTypes.string,
  initialResponse: PropTypes.string,
};

export default GraphiQLBlock;
