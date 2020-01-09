import React from 'react';
import ReactTable from 'react-table';
import {
  KsPopover,
  KsButton,
  KsButtonGroup,
  StatusIcon,
} from '@knapsack/design-system';
import { NavLink, useHistory } from 'react-router-dom';
import { BASE_PATHS } from '../../lib/constants';
import { KnapsackPattern } from '../../schemas/patterns';
import { useSelector, useDispatch, deletePattern } from '../store';
import { TemplateThumbnail } from './template-thumbnail';

type Props = {
  allPatterns: KnapsackPattern[];
};

export const PatternTable: React.FC<Props> = ({ allPatterns }: Props) => {
  const { patterns, templateStatuses, renderers } = useSelector(
    s => s.patternsState,
  );
  const dispatch = useDispatch();
  const history = useHistory();

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
        // expands all rows. `expanded` takes an object like `{0: true, 1: true}` to show the first & second row as expanded
        expanded={Object.keys(data).map((key, i) => ({
          [i]: true,
        }))}
        columns={columns}
        showPagination={false}
        defaultPageSize={data.length}
        SubComponent={({ original: { data: subData, patternId } }) => {
          const pattern = patterns[patternId];

          return (
            <aside className="ks-pattern-table__pattern-details ks-u-grid">
              <div>
                <h3>{pattern.title || patternId}</h3>
                <KsButtonGroup>
                  <KsButton
                    size="s"
                    handleTrigger={() => {
                      history.push(`${BASE_PATHS.PATTERN}/${patternId}`);
                    }}
                  >
                    View
                  </KsButton>
                  <KsPopover
                    trigger="click"
                    content={
                      <p>
                        Are you sure?{' '}
                        <KsButton
                          kind="primary"
                          emphasis="danger"
                          size="s"
                          handleTrigger={() => {
                            dispatch(
                              deletePattern({
                                patternId: pattern.id,
                              }),
                            );
                          }}
                        >
                          Yes
                        </KsButton>
                      </p>
                    }
                  >
                    <KsButton icon="delete" kind="standard" size="s">
                      Delete
                    </KsButton>
                  </KsPopover>
                </KsButtonGroup>
                <div className="ks-u-margin-top--m">
                  <TemplateThumbnail
                    patternId={patternId}
                    handleSelection={() => {
                      history.push(`${BASE_PATHS.PATTERN}/${patternId}`);
                    }}
                  />
                </div>
              </div>
              <div>
                <ReactTable
                  defaultPageSize={subData.length}
                  data={subData}
                  showPagination={false}
                  columns={[
                    {
                      Header: 'Template Language',
                      accessor: 'templateLanguageId',
                      Cell: cell => {
                        const renderer = renderers[cell.value];
                        if (!renderer) {
                          return null;
                        }
                        return (
                          <NavLink
                            to={`${BASE_PATHS.PATTERN}/${patternId}/${cell.value.templateId}`}
                          >
                            <span
                              className="ks-edit-template-demo__logo"
                              dangerouslySetInnerHTML={{
                                __html: renderer.meta.iconSvg,
                              }}
                            />
                            {renderer.meta.title}
                          </NavLink>
                        );
                      },
                    },
                    {
                      Header: 'Status',
                      accessor: 'statusId',
                      Cell: cell => {
                        const status = templateStatuses.find(
                          s => s.id === cell?.value,
                        );
                        if (!status) {
                          return null;
                        }
                        return (
                          <NavLink
                            to={`${BASE_PATHS.PATTERN}/${patternId}/${cell.value.templateId}`}
                          >
                            <StatusIcon hasTitle status={status} />
                          </NavLink>
                        );
                      },
                    },
                  ]}
                />
              </div>
            </aside>
          );
        }}
      />
    </div>
  );
};
