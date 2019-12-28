import React from 'react';
import ReactTable from 'react-table';
import { NavLink } from 'react-router-dom';
import { BASE_PATHS } from '../../lib/constants';
import { KnapsackPattern } from '../../schemas/patterns';

type Props = {
  allPatterns: KnapsackPattern[];
};

/**
 * @todo expand all rows by default
 * @todo add delete pattern button
 */
export const PatternTable: React.FC<Props> = ({ allPatterns }: Props) => {
  const data = [];
  allPatterns.forEach(
    ({ title: patternTitle, id: patternId, description, templates }) => {
      data.push({
        patternTitle,
        patternId,
        description,
        data: templates.map(
          ({
            id: templateId,
            title: templateTitle,
            templateLanguageId,
            statusId,
          }) => {
            return {
              templateId,
              templateTitle,
              templateLanguageId,
              statusId,
            };
          },
        ),
      });
    },
  );
  const columns = [
    {
      Header: 'Pattern Title',
      id: 'PatternTitle',
      accessor: ({ patternId, patternTitle }) => ({ patternId, patternTitle }),
      Cell: cell => (
        <NavLink to={`${BASE_PATHS.PATTERN}/${cell.value.patternId}`}>
          {cell.value.patternTitle}
        </NavLink>
      ),
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
  ];
  return (
    <div className="ks-pattern-table">
      <ReactTable
        className="ks-pattern-table__table"
        data={data}
        columns={columns}
        showPagination={false}
        defaultPageSize={data.length}
        SubComponent={({ original: { data: subData, patternId } }) => {
          return (
            <ReactTable
              defaultPageSize={subData.length}
              data={subData}
              showPagination={false}
              columns={[
                {
                  Header: 'Template Title',
                  id: 'TemplateTitle',
                  accessor: ({ templateId, templateTitle }) => ({
                    templateId,
                    templateTitle,
                  }),
                  Cell: cell => (
                    <NavLink
                      to={`${BASE_PATHS.PATTERN}/${patternId}/${cell.value.templateId}`}
                    >
                      {cell.value.templateTitle}
                    </NavLink>
                  ),
                },
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
