import React from 'react';
import ReactTable from 'react-table';

type Props = {
  allPatterns: KnapsackPattern[];
};

export const PatternTable: React.FC<Props> = ({ allPatterns }: Props) => {
  const data = [];
  allPatterns.forEach(({ title: patternTitle, description, templates }) => {
    data.push({
      patternTitle,
      description,
      data: templates.map(
        ({ title: templateTitle, templateLanguageId, statusId }) => {
          return {
            templateTitle,
            templateLanguageId,
            statusId,
          };
        },
      ),
    });
  });
  const columns = [
    {
      Header: 'Pattern Title',
      accessor: 'patternTitle',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
  ];
  return (
    <div className="k-pattern-table">
      <ReactTable
        className="k-pattern-table__table"
        data={data}
        columns={columns}
        showPagination={false}
        defaultPageSize={data.length}
        SubComponent={row => {
          return (
            <ReactTable
              defaultPageSize={row.original.data.length}
              data={row.original.data}
              columns={[
                { Header: 'Template Title', accessor: 'templateTitle' },
                { Header: 'Template Language', accessor: 'templateLanguageId' },
                { Header: 'Status', accessor: 'statusId' },
              ]}
            />
          );
        }}
      />
    </div>
  );
};
