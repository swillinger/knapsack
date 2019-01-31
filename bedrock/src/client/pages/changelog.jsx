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
import Spinner from '@basalt/bedrock-spinner';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { StatusMessage } from '@basalt/bedrock-atoms';
import MdBlock from '../components/md-block';
import PageWithSidebar from '../layouts/page-with-sidebar';

const query = gql`
  {
    meta {
      changelog
      version
    }
  }
`;

function ChangelogPage() {
  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }
        if (error) {
          return <StatusMessage message={error.message} type="error" />;
        }

        const {
          meta: { changelog },
        } = data;

        return (
          <PageWithSidebar className="doc-group">
            <div>
              <header
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              />
              <div>
                <MdBlock md={changelog} isEditable={false} />
              </div>
            </div>
          </PageWithSidebar>
        );
      }}
    </Query>
  );
}

export default ChangelogPage;
