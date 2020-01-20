import React from 'react';
import ReactTable from 'react-table';
import {
  KsPopover,
  KsButton,
  StatusIcon,
  KsDetails,
} from '@knapsack/design-system';
import { Link, useHistory } from 'react-router-dom';
import { BASE_PATHS } from '../../lib/constants';
import { KnapsackPattern } from '../../schemas/patterns';
import { useSelector, useDispatch, deletePattern } from '../store';
import { TemplateThumbnail } from './template-thumbnail';
import './pattern-table.scss';

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

  return (
    <>
      {data.map(({ data: subData, patternId }) => {
        const pattern = patterns[patternId];

        return (
          <KsDetails
            key={`pattern-${patternId}`}
            titleContent={
              <div className="pattern-table__item-header">
                <div className="pattern-table__item-header__title">
                  <Link to={`${BASE_PATHS.PATTERN}/${patternId}`}>
                    {pattern.title || patternId}
                  </Link>
                </div>
                <div className="pattern-table__item-header__statuses">
                  {pattern.templates.map(template => {
                    const status = templateStatuses.find(
                      s => s.id === template.statusId,
                    );

                    return (
                      status && (
                        <KsPopover
                          key={`${patternId}-${template.id}`}
                          trigger="hover"
                          content={
                            <span>
                              {template.templateLanguageId} Template Status:{' '}
                              <strong>{status.title}</strong>
                            </span>
                          }
                        >
                          <StatusIcon status={status} />
                        </KsPopover>
                      )
                    );
                  })}
                </div>
              </div>
            }
          >
            <div className="pattern-table__content">
              <div>
                {/* @TODO: Determine if Delete should be here. */}
                {/* <KsPopover
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
                </KsPopover> */}
                {pattern.description && (
                  <div className="pattern-table__content__description">
                    <h4>Description</h4>
                    <p>{pattern.description}</p>
                  </div>
                )}
                <div className="pattern-table__content__thumbnail">
                  <TemplateThumbnail
                    patternId={patternId}
                    handleSelection={() => {
                      history.push(`${BASE_PATHS.PATTERN}/${patternId}`);
                    }}
                    thumbnailSize={240}
                  />
                </div>
              </div>
              <div>
                <h4>Templates</h4>
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
                          <div>
                            <span
                              className="pattern-table__content__language-icon"
                              dangerouslySetInnerHTML={{
                                __html: renderer.meta.iconSvg,
                              }}
                            />
                            <span className="pattern-table__content__language-title">
                              {renderer.meta.title}
                            </span>
                          </div>
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
                          return <p>Error: No Status Found</p>;
                        }
                        return <StatusIcon hasTitle status={status} />;
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </KsDetails>
        );
      })}
    </>
  );
};
