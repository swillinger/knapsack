import React, { useContext } from 'react';
import { Details } from '@knapsack/design-system';
import ReactTable from 'react-table';
import cn from 'classnames';
import { CurrentTemplateContext } from '../current-template-context';
import './spec-docs.scss';
import { LoadableSchemaTable } from '../../../loadable-components';

type Props = {};

export const KsSpecDocs: React.FC<Props> = ({}: Props) => {
  const { hasSchema, spec } = useContext(CurrentTemplateContext);

  const classes = cn({
    'ks-spec-docs': true,
  });
  return (
    <div className={classes}>
      {hasSchema && (
        <>
          <div>
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
      {spec.slots && (
        <div>
          <h4>Slots</h4>
          <ReactTable
            data={Object.keys(spec.slots).map(slotName => {
              const { title: slotTitle, description } = spec.slots[slotName];
              return {
                slotName,
                slotTitle,
                description,
              };
            })}
            columns={[
              { Header: 'Slot Name', accessor: 'slotName' },
              { Header: 'Title', accessor: 'slotTitle' },
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
