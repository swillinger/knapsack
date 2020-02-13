import React from 'react';
import { KsDetails, SchemaTable } from '@knapsack/design-system';
import ReactTable from 'react-table';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { useCurrentTemplateContext } from '../current-template-context';
import './spec-docs.scss';
import { BASE_PATHS } from '../../../../lib/constants';

type Props = {};

// eslint-disable-next-line no-empty-pattern
const KsSpecDocs: React.FC<Props> = ({}: Props) => {
  const { hasSchema, spec } = useCurrentTemplateContext();

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
            <KsDetails open titleContent="Props Table">
              <SchemaTable schema={spec?.props} />
            </KsDetails>
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
            key={Object.keys(spec.slots).length}
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
                      <span key={pId}>
                        <Link to={`${BASE_PATHS.PATTERN}/${pId}`}>{pId}</Link>
                        {!isLast && <span>, </span>}
                      </span>
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

export default KsSpecDocs;
