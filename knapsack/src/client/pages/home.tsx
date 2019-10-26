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
import { connectToContext } from '@knapsack/core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@knapsack/spinner';
import { StatusMessage } from '@knapsack/atoms';
import PageWithoutSidebar from '../layouts/page-without-sidebar';
import { HomeSplash } from '../components/home-splash';

const query = gql`
  {
    settings {
      title
      subtitle
      slogan
    }
    meta {
      version
    }
  }
`;

const HomePage = props => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <Spinner />;
      if (error) return <StatusMessage message={error.message} type="error " />;

      const {
        settings: { title, subtitle, slogan },
        meta: { version },
      } = data;
      return (
        <PageWithoutSidebar {...props}>
          <HomeSplash
            title={title}
            subtitle={subtitle}
            slogan={slogan}
            version={version}
          />
        </PageWithoutSidebar>
      );
    }}
  </Query>
);

export default connectToContext(HomePage);
