import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import marked from 'marked';
import './schema-table.scss';

/*
 * Takes a string and returns the same string with first letter
 * uppercase and the rest of the letters lowercase
 * @param {string} string
 * @return {string}
 */
function toCapital(string) {
  return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}

/*
 * Takes a string and capitalizes each word (as delineated by spaces)
 * @param {string} string
 * @return {string}
 */
function toTitleCase(string) {
  return string
    .split(' ')
    .map(word => toCapital(word))
    .join(' ');
}

/*
 * Creates the expandable tray with description and
 * additional props tables for objects and arrays
 * @param {object} row
 * @returns React.ReactNode
 */
function SchemaTableExpandable(row) {
  const noInfoAvailable =
    !row.original.data.description &&
    !(row.original.data.properties || row.original.data.items);
  return (
    <div style={{ padding: '20px' }}>
      {/* Display a description if available */}
      {row.original.data.description && (
        <>
          <h5>Description</h5>
          <p
            dangerouslySetInnerHTML={{
              __html: marked.parse(row.original.data.description),
            }}
          />
        </>
      )}
      {/* Display a props table for objects */}
      {(row.original.data.type === 'object' ||
        row.original.data.type === 'array') && (
        <>
          <h5>
            Props for <code>{row.original.prop}</code>
          </h5>
          <SchemaTable schema={row.original.data} />
        </>
      )}
      {/* Display the possible enums for a string */}
      {row.original.data.type === 'string' && 'enum' in row.original.data && (
        <>
          <span>One of: </span>
          <code>{row.original.data.enum.join(', ')}</code>
        </>
      )}

      {/* Display a message if no info is available */}
      {noInfoAvailable && (
        <p>
          <em>No additional information is available.</em>
        </p>
      )}
    </div>
  );
}

export const SchemaTable = ({ schema }) => {
  if (!schema) return null;
  const required = schema.required || [];

  let data = [];
  if (schema.properties) {
    // if schema table is for an object
    data = Object.keys(schema.properties).map(propName => {
      const property = schema.properties[propName];
      return {
        prop: propName,
        // title: property.title || toTitleCase(propName),
        type: property.type,
        data: property,
        required: property.required || required.includes(propName),
      };
    });
  } else if (
    schema.items &&
    schema.items.type === 'object' &&
    schema.items.properties
  ) {
    // if schema table is for an array of objects
    data = Object.keys(schema.items.properties).map(propName => {
      const property = schema.items.properties[propName];
      return {
        prop: propName,
        // title: property.title || toTitleCase(propName),
        type: property.type,
        data: property,
      };
    });
  } else if (schema.items) {
    // if schema table is for an array of anything except objects
    data = [
      {
        prop: schema.items.title || 'item',
        // title:
        //   (schema.items.title && toTitleCase(schema.items.title)) || 'Item',
        type: schema.items.type,
        data: schema.items,
      },
    ];
  }

  const columns = [
    // {
    //   Header: 'Name',
    //   accessor: 'title',
    //   minWidth: 60,
    //   Cell: cell => (
    //     <div>
    //       <span className="schema-table__title">{cell.value}</span>
    //       {cell.original.required && (
    //         <span className="schema-table__required-label">*</span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      Header: 'Prop',
      accessor: 'prop',
      minWidth: 60,
      Cell: cell => (
        <div>
          <code>{cell.value}</code>
          {cell.original.required && (
            <span style={{ color: 'var(--c-danger)' }}>*</span>
          )}
        </div>
      ),
    },
    {
      Header: 'Type',
      id: 'type',
      accessor: item => {
        if (item.type) return item.type;
        if (item.data.typeof) {
          if (item.data.description) return item.data.description;
          return item.data.typeof;
        }

        return 'unknown';
      },
      Cell: cell => {
        let displayedType = cell.value;
        if (cell.value === 'array') {
          displayedType = `array of ${`${cell.original.data.items.type}s` ||
            'any'}`;
        } else if (typeof cell.value === 'object') {
          displayedType = cell.value.join(' | ');
        }
        return (
          <span>
            <code>{displayedType}</code>
          </span>
        );
      },
      minWidth: 50,
      style: {
        whiteSpace: 'initial',
      },
    },
    {
      Header: 'Details',
      id: 'details',
      accessor: item => {
        if (item.data.tsType) {
          return <code>{item.data.tsType}</code>;
        }
        if (item.data.enum) {
          return <span>Options viewable in More</span>;
        }
        return '';
      },
    },
    {
      Header: 'Default',
      id: 'default',
      minWidth: 50,
      accessor: item => {
        if (item.data.default) {
          return <code>{JSON.stringify(item.data.default)}</code>;
        }
        return '-';
      },
    },
    {
      Header: 'More',
      width: 65,
      expander: true,
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
  ];

  return (
    <div className="ks-schema-table">
      <ReactTable
        // classname prefix ks- not added due to third party library
        className="schema-table -striped -highlight"
        data={data}
        key={data.length} // trigger re-rendering when new columns added
        columns={columns}
        showPagination={false}
        defaultPageSize={data.length}
        SubComponent={row => SchemaTableExpandable(row)}
      />
    </div>
  );
};

SchemaTable.propTypes = {
  schema: PropTypes.object.isRequired,
};
