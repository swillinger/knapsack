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
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { PieChart, Pie, YAxis, XAxis, Bar, BarChart } from 'recharts';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';
import PageWithSidebar from '../layouts/page-with-sidebar';
import {} from 'styled-components';

const query = gql`
  {
    tokenCategories {
      id
      name
      hasDemo
      tokens {
        name
        type
      }
    }
    tokens {
      category
      name
      type
    }
    tokenGroups {
      title
    }
    patterns {
      meta {
        title
      }
      templates {
        schema
      }
    }
  }
`;

function Statistics() {
  return (
    <PageWithSidebar>
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error)
            return <StatusMessage message={error.message} type="error " />;

          const { patterns, tokens, tokenGroups, tokenCategories } = data;

          const tokenCatStats = tokenCategories
            .map(category => ({
              totalTokens: category.tokens.length,
              name: category.name,
            }))
            .sort((a, b) => b.totalTokens - a.totalTokens);

          const tokenTypes = [];
          [...new Set(tokens.map(token => token.type))].forEach(type => {
            tokenTypes.push({ name: type });
          });
          tokens.forEach(token => {
            const tokenType = tokenTypes.find(type => type.name === token.type);
            const { value = 0 } = tokenType;
            tokenType.value = value + 1;
            return true;
          });

          const templateCount = patterns.reduce(
            (accumulator, pattern) => accumulator + pattern.templates.length,
            0,
          );

          const templates = patterns
            .reduce(
              (accumulator, pattern) => [...accumulator, ...pattern.templates],
              [],
            )
            .map(template => ({
              name: `${template.schema.title}${
                template.title ? `: ${template.title}` : ''
              }`,
              propertiesCount: Object.keys(template.schema.properties).length,
            }))
            .sort((a, b) => b.propertiesCount - a.propertiesCount);
          return (
            <div>
              <h2>Patterns</h2>
              <h4>Number of patterns: {patterns.length}</h4>
              <h4>Number of templates: {templateCount}</h4>
              <h4>Properties per template</h4>
              <BarChart width={1200} height={400} data={templates}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="propertiesCount" fill="hsl(200,55%,19%)" />
              </BarChart>
              <hr />
              <h2>Tokens</h2>
              <h4>Tokens: {tokens.length}</h4>
              <h4>Token Groups: {tokenGroups.length}</h4>
              <h4>Token Categories: {tokenCatStats.length}</h4>
              <PieChart width={800} height={400}>
                <Pie
                  startAngle={0}
                  endAngle={360}
                  data={tokenCatStats}
                  cx={400}
                  cy={200}
                  dataKey="totalTokens"
                  outerRadius={160}
                  fill="hsl(200,55%,19%)"
                  label={({ name, totalTokens }) => `${name}: ${totalTokens}`}
                />
              </PieChart>
              <h4>Token Types: {tokenTypes.length}</h4>
              <PieChart width={800} height={400}>
                <Pie
                  startAngle={0}
                  endAngle={360}
                  data={tokenTypes.sort((a, b) => b.value - a.value)}
                  cx={400}
                  cy={200}
                  outerRadius={160}
                  fill="hsl(200,55%,19%)"
                  label={({ name, value }) => `${name}: ${value}`}
                />
              </PieChart>
            </div>
          );
        }}
      </Query>
    </PageWithSidebar>
  );
}

export default Statistics;
