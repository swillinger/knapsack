import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { containsString } from '@basalt/bedrock-utils';
import CopyToClipboard from '@basalt/bedrock-copy-to-clipboard';
import { demoPropTypes } from './utils';
import './table-list.css';

const columnHeader = text => <div style={{ textAlign: 'left' }}>{text}</div>;
const filterInput = ({ onChange }) => (
  <input
    onChange={event => onChange(event.target.value)}
    style={{ width: '100%' }}
    placeholder="Type to filter"
  />
);
filterInput.propTypes = {
  onChange: PropTypes.func.isRequired,
};
/* eslint-disable no-underscore-dangle */
const expandableContent = ({ row }) => (
  <div style={{ padding: '10px' }}>
    <p>
      {row._original.category && (
        <>
          <strong>Category:</strong> {row._original.category}
          <br />
        </>
      )}
      {row._original.tags && !!row._original.tags.length && (
        <>
          <strong>Tags:</strong> {row._original.tags.join(', ')}
          <br />
        </>
      )}
      {row._original.comment && (
        <>
          <strong>Comments:</strong> {row._original.comment}
          <br />
        </>
      )}
    </p>
  </div>
);
/* eslint-enable no-underscore-dangle */
expandableContent.propTypes = {
  row: PropTypes.object.isRequired,
};
const expanderToggle = ({ isExpanded }) => (
  <div>{isExpanded ? <span>&#x2299;</span> : <span>&#x2295;</span>}</div>
);
expanderToggle.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
};

export const DesignTokenTable = ({ tokens }) => {
  if (!tokens) return null;
  return (
    <div>
      <ReactTable
        // Styling props
        className="-striped -highlight"
        showPagination={false}
        defaultPageSize={tokens.length}
        style={{
          maxHeight: '50vh', // This will force the table body to overflow and scroll, since there is not enough room
        }}
        // Data props
        data={tokens}
        noDataText="No tokens match the search criteria"
        columns={[
          {
            Header: columnHeader('Code'),
            accessor: 'code',
            Cell: row => (
              <div>
                <CopyToClipboard snippet={row.value} />
              </div>
            ),
          },
          {
            Header: columnHeader('Value'),
            accessor: 'value',
            Cell: row => (
              <div>
                <CopyToClipboard snippet={row.value} />
              </div>
            ),
          },
          {
            Header: () => <strong>More</strong>,
            width: 65,
            expander: true,
            Expander: expanderToggle,
            style: {
              cursor: 'pointer',
              fontSize: 25,
              padding: '0',
              textAlign: 'center',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        ]}
        // Filter props
        filterable
        FilterComponent={filterInput}
        defaultFilterMethod={(filter, row) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined
            ? containsString(String(row[id]), filter.value)
            : true;
        }}
        // Expandable component
        SubComponent={expandableContent}
      />
    </div>
  );
};

DesignTokenTable.propTypes = demoPropTypes;
