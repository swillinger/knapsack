import React, { useContext } from 'react';
import { Details } from '@knapsack/design-system';
import ReactTable from 'react-table';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { CurrentTemplateContext } from '../current-template-context';
import './spec-docs.scss';
import { LoadableSchemaTable } from '../../../loadable-components';
import { BASE_PATHS } from '../../../../lib/constants';

type Props = {};

// eslint-disable-next-line no-empty-pattern
export const KsSpecDocs: React.FC<Props> = ({}: Props) => {
  const { hasSchema, spec } = useContext(CurrentTemplateContext);

  const classes = cn({
    'ks-spec-docs': true,
  });
  return (
    <div className={classes}>
      {hasSchema && (
        <>
          <div className="ks-spec-docs__properties">
            <h4>Properties</h4>
            <p>
              The following properties make up the data that defines each
              instance of this component.
            </p>
            <Details open>
              <summary>Props Table</summary>
              <LoadableSchemaTable schema={spec?.props} />
            </Details>
          </div>

          {/* <LoadableVariationDemo */}
          {/*  schema={schema} */}
          {/*  templateId={templateId} */}
          {/*  patternId={id} */}
          {/*  data={demoDatas[demoDataIndex]} */}
          {/*  key={`${id}-${templateId}-${demoDataIndex}`} */}
          {/* /> */}
        </>
      )}
      {Object.keys(spec?.slots || {})?.length > 0 && (
        <div>
          <h4>Slots</h4>
          <ReactTable
            data={Object.keys(spec.slots).map(slotName => {
              const {
                title: slotTitle,
                description,
                allowedPatternIds,
              } = spec.slots[slotName];
              return {
                slotName,
                slotTitle,
                description,
                allowedPatternIds,
              };
            })}
            columns={[
              {
                Header: 'Slot Name',
                accessor: 'slotName',
                Cell: cell => <code>{cell.value}</code>,
              },
              {
                Header: 'Allowed Patterns',
                accessor: 'allowedPatternIds',
                Cell: cell => {
                  const { value: allowedPatternIds } = cell;
                  if (!Array.isArray(allowedPatternIds)) {
                    return <span>All</span>;
                  }
                  if (allowedPatternIds.length === 0) {
                    return <span>None</span>;
                  }
                  return allowedPatternIds.map((pId, i) => {
                    const isLast = allowedPatternIds.length === i + 1;
                    return (
                      <>
                        <Link key={pId} to={`${BASE_PATHS.PATTERN}/${pId}`}>
                          {pId}
                        </Link>
                        {!isLast && <span>, </span>}
                      </>
                    );
                  });
                },
              },
              { Header: 'Description', accessor: 'description' },
            ]}
            defaultPageSize={Object.keys(spec.slots).length}
            showPagination={false}
          />
        </div>
      )}
    </div>
  );
};
