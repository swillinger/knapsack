/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
// import PropTypes from 'prop-types';
// import GraphiQL from 'graphiql'; // https://www.npmjs.com/package/graphiql
// import 'graphiql/graphiql.css';
// import { gqlQuery } from '../data';

/**
 * Simply applies default graphql function
 * Instantiating this component with a 'fetcher' attribute will override the default
 * @param {object} props - react props
 * @returns {*}
 * @constructor
 */
function GraphiQLBlock() {
  return (
    <h1>GraphiQL is temporarily disabled.</h1>
    // <GraphiQL
    //   fetcher={({ query, variables }) => gqlQuery({ query, variables })}
    //   query={props.initialQuery}
    //   variables={props.initialVariables}
    //   response={props.initialResponse}
    // />
  );
}
// GraphiQLBlock.defaultProps = {
//   initialQuery: null,
//   initialVariables: null,
//   initialResponse: '',
// };
//
// GraphiQLBlock.propTypes = {
//   initialQuery: PropTypes.string,
//   initialVariables: PropTypes.string,
//   initialResponse: PropTypes.string,
// };

export default GraphiQLBlock;
