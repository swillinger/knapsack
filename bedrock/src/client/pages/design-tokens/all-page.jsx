import React from 'react';
import Spinner from '@basalt/bedrock-spinner';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { StatusMessage } from '@basalt/bedrock-atoms';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PageWithSidebar from '../../layouts/page-with-sidebar';

const query = gql`
  {
    tokens {
      value
      originalValue
      category
      name
      value
      comment
    }
  }
`;

function AllPage(props) {
  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <Spinner />;
        if (error)
          return <StatusMessage message={error.message} type="error" />;
        return (
          <PageWithSidebar {...props}>
            <h4 className="eyebrow">Design Tokens</h4>
            <h2>All Tokens</h2>
            <ReactTable
              data={data.tokens}
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Value',
                  accessor: 'value',
                },
                {
                  Header: 'Category',
                  accessor: 'category',
                },
                {
                  Header: 'Original Value',
                  accessor: 'originalValue',
                },
                {
                  Header: 'Type',
                  accessor: 'type',
                },
              ]}
              showPagination={false}
              defaultPageSize={data.tokens.length}
              filterable
            />
          </PageWithSidebar>
        );
      }}
    </Query>
  );
}

export default AllPage;
