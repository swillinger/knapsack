import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { containsString } from '@basalt/bedrock-utils';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const DesignTokenTable = ({ tokens }) => {
  if (!tokens) return null;
  return (
    <ReactTable
      data={tokens}
      columns={[
        {
          Header: 'Code',
          accessor: 'code',
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
          Header: 'Tags',
          accessor: 'tags',
        },
        {
          Header: 'Comments',
          accessor: 'comment',
        },
      ]}
      showPagination={false}
      defaultPageSize={tokens.length}
      filterable
      defaultFilterMethod={(filter, row) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined
          ? containsString(String(row[id]), filter.value)
          : true;
      }}
    />
  );
};

DesignTokenTable.tokenCategory = TOKEN_CATS.TABLE_LIST;

DesignTokenTable.propTypes = demoPropTypes;
