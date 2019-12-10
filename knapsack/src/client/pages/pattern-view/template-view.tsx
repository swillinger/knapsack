/**
 *  Copyright (C) 2018 Basalt
 This file is part of Knapsack.
 Knapsack is free software; you can redistribute it and/or modify it
 under the terms of the GNU General Public License as published by the Free
 Software Foundation; either version 2 of the License, or (at your option)
 any later version.

 Knapsack is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 more details.

 You should have received a copy of the GNU General Public License along
 with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */

import React, { useState } from 'react';
import { SchemaForm, Details, Select, KsButton } from '@knapsack/design-system';
import { useHistory } from 'react-router-dom';
import ReactTable from 'react-table';
import produce from 'immer';
import {
  useSelector,
  updatePattern,
  useDispatch,
  updateTemplateDemo,
  updatePatternInfo,
  updateTemplateInfo,
  addTemplateDataDemo,
  removeTemplateDemo,
} from '../../store';
import MdBlock from '../../components/md-block';
import Template from '../../components/template';
import TemplateCodeBlock from './components/template-code-block';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../../loadable-components';
// import DosAndDonts from '../../components/dos-and-donts';
import { TemplateHeader } from './components/template-header';
import './template-view.scss';
import './shared/demo-grid-controls.scss';
import { isDataDemo, isTemplateDemo } from '../../../schemas/patterns';
import { TemplateThumbnail } from '../../components/template-thumbnail';
import { Tabs } from '../../components/tabs';
import { InlineEditText } from '../../components/inline-edit';
import { KsRenderResults } from '../../../schemas/knapsack-config';
import { KsSlotsForm } from './components/slots-form';
import { BASE_PATHS } from '../../../lib/constants';

const calculateDemoStageWidth = (size: string) => {
  switch (size) {
    case 's':
      return '33%';
    case 'm':
      return '50%';
    case 'l':
      return '67%';
    default:
      return '100%';
  }
};

const calculateSchemaFormWidth = (size: string) => {
  switch (size) {
    case 's':
      return '67%';
    case 'm':
      return '50%';
    case 'l':
      return '33%';
    default:
      return '100%';
  }
};

export type Props = {
  /**
   * Pattern ID
   */
  id: string;
  templateId: string;
  demoId?: string;
  isVerbose?: boolean;
  /**
   * @todo remove `string` - it's just to make Typescript happy
   */
  demoSize?: 's' | 'm' | 'l' | 'full' | string;
  isReadmeShown?: boolean;
  isTitleShown?: boolean;
  isSchemaFormShown?: boolean;
  isCodeBlockShown?: boolean;
};

const TemplateView: React.FC<Props> = ({
  isVerbose = true,
  demoSize = 'full',
  isReadmeShown = true,
  isTitleShown = true,
  isSchemaFormShown = true,
  isCodeBlockShown = false,
  id,
  templateId,
  demoId,
}: Props) => {
  const patternId = id;
  const permissions = useSelector(store => store.userState.role.permissions);
  const canEdit = useSelector(store => store.userState.canEdit);
  const patterns = useSelector(({ patternsState }) => patternsState.patterns);
  const allPatterns = useSelector(({ patternsState }) =>
    Object.values(patternsState.patterns),
  );
  const pattern = useSelector(
    ({ patternsState }) => patternsState.patterns[id],
  );
  if (!pattern) {
    const availablePatternIds = allPatterns.map(p => p.id).join(', ');
    const msg = `The pattern "${id}" was not found, these are the available ids: "${availablePatternIds}".`;
    console.error(msg);
    throw new Error(msg);
  }
  const history = useHistory();
  const allStatuses = useSelector(s => s.patternsState.templateStatuses);
  const { allAssetSets, globalAssetSetIds } = useSelector(
    ({ assetSetsState }) => ({
      allAssetSets: assetSetsState.allAssetSets,
      globalAssetSetIds: assetSetsState.globalAssetSetIds,
    }),
  );
  const dispatch = useDispatch();

  const { templates } = pattern;

  const template = templates.find(t => t.id === templateId);
  if (!template) {
    const availableTemplateIds = templates.map(t => t.id).join(', ');
    const msg = `In the pattern "${id}", the template "${templateId}" was not found, these are the available ids: "${availableTemplateIds}".`;
    console.error(msg);
    throw new Error(msg);
  }

  const {
    spec = {},
    // doc: readme,
    title,
    assetSetIds = globalAssetSetIds,
    demosById,
    statusId,
    // demoDatas = [],
    // assetSets = [],
  } = template;

  const { props: schema } = spec;
  const status = allStatuses.find(p => p.id === statusId);

  const readme = '';
  const assetSets = assetSetIds.map(assetSetId => ({
    id: assetSetId,
    ...allAssetSets[assetSetId],
  }));

  const demos = template.demos.map(d => demosById[d]);

  const hasSchema = !!(
    schema &&
    schema.properties &&
    Object.keys(schema.properties).length > 0
  );
  const [firstDemo] = demos;
  const initialDemo = demoId ? demosById[demoId] : firstDemo;
  if (demoId && !initialDemo) {
    throw new Error(
      `No demo found for pattern ${id} template ${templateId} demo ${demoId}`,
    );
  }

  const [demoIndex, setDemoIndex] = useState(0);
  const [demo, setDemo] = useState(initialDemo);
  const demoWidth =
    pattern.demoWidths && pattern.demoWidths.length > 0
      ? pattern.demoWidths[0].width
      : 400;
  // const demo = demos[demoIndex];

  // const [dataState, setDataState] = useState({
  //   demoDataIndex: 0,
  //   data: demoDatas[0],
  // });

  const [assetSetId, setAssetSetId] = useState(
    assetSets[0] ? assetSets[0].id : '',
  );
  const [templateInfo, setTemplateInfo] = useState<
    KsRenderResults & { url: string }
  >();

  const showSchemaForm = isSchemaFormShown && hasSchema;



  return (
    <article className="ks-template-view">
      <div className="ks-template-view__overview-wrapper">
        <TemplateHeader
          title={title}
          assetSets={assetSets}
          status={status}
          isTitleShown={!isVerbose && isTitleShown}
          handleAssetSetChange={newAssetSetId => {
            setAssetSetId(newAssetSetId);
          }}
          handleStatusChange={newStatusId => {
            dispatch(
              updateTemplateInfo({
                templateId,
                patternId,
                template: {
                  statusId: newStatusId,
                },
              }),
            );
          }}
        />

        <div
          className="ks-template-view__demo-grid"
          style={{
            display:
              (showSchemaForm ? demoSize : 'full') === 'full'
                ? 'block'
                : 'flex',
          }}
        >
          <div
            className="ks-template-view__demo-stage"
            style={{
              width: calculateDemoStageWidth(
                showSchemaForm ? demoSize : 'full',
              ),
            }}
          >
            <span className="ks-template-view__demo-stage__open-btn">
              <KsButton
                kind="icon"
                icon="external-link"
                flush
                onClick={() => {
                  if (templateInfo?.url) {
                    window.open(templateInfo.url, '_blank');
                  }
                }}
              >
                Open in New Window
              </KsButton>
            </span>
            <Template
              patternId={id}
              templateId={templateId}
              assetSetId={assetSetId}
              demo={demo}
              isResizable
              handleTemplateInfo={setTemplateInfo}
            />
          </div>
          {showSchemaForm && isDataDemo(demo) && (
            <div
              className="ks-template-view__schema-form"
              style={{
                width: calculateSchemaFormWidth(demoSize),
              }}
            >
              <div className="ks-template-view__schema-form__inner">
                <header className="ks-template-view__schema-form__header">
                  <h3>
                    <InlineEditText
                      text={demo.title}
                      isHeading
                      handleSave={text => {
                        dispatch(
                          updateTemplateDemo({
                            patternId,
                            templateId,
                            demo: {
                              ...demo,
                              title: text,
                            },
                          }),
                        );
                      }}
                    />
                  </h3>
                  <p>
                    <InlineEditText
                      text={demo.description}
                      handleSave={text => {
                        dispatch(
                          updateTemplateDemo({
                            patternId,
                            templateId,
                            demo: {
                              ...demo,
                              description: text,
                            },
                          }),
                        );
                      }}
                    />
                  </p>
                </header>
                <Tabs
                  panes={[
                    {
                      menuItem: 'Props',
                      render: () => {
                        return (
                          <>
                            <h4>Edit Form</h4>
                            <SchemaForm
                              schema={schema}
                              formData={demo.data.props}
                              onChange={({ formData }) => {
                                setDemo(prevDemo =>
                                  produce(prevDemo, draft => {
                                    if (isDataDemo(draft)) {
                                      draft.data.props = formData;
                                    }
                                  }),
                                );
                              }}
                            />
                          </>
                        );
                      },
                    },
                    spec.slots
                      ? {
                          menuItem: 'Slots',
                          render: () => {
                            if (!isDataDemo(demo)) return;

                            return (
                              <KsSlotsForm
                                slotsData={demo.data.slots}
                                slotsSpec={spec.slots}
                                templateLanguageId={template.templateLanguageId}
                                handleData={slotsData => {
                                  // console.log('new slots data', slotsData);
                                  setDemo(prevDemo =>
                                    produce(prevDemo, draft => {
                                      if (isDataDemo(draft)) {
                                        draft.data.slots = slotsData;
                                      }
                                    }),
                                  );
                                }}
                              />
                            );
                          },
                        }
                      : null,
                  ].filter(Boolean)}
                />
                {canEdit && (
                  <>
                    <hr />
                    <KsButton
                      kind="primary"
                      onClick={() => {
                        dispatch(
                          updateTemplateDemo({
                            patternId,
                            templateId,
                            demo,
                          }),
                        );
                      }}
                    >
                      Save Demo
                    </KsButton>
                    <KsButton
                      onClick={() => {
                        dispatch(
                          addTemplateDataDemo({
                            patternId,
                            templateId,
                          }),
                        );
                        // @todo go to it after
                      }}
                    >
                      Add new demo
                    </KsButton>
                    <KsButton
                      onClick={() => {
                        dispatch(
                          removeTemplateDemo({
                            patternId,
                            templateId,
                            demoId: demo.id,
                          }),
                        );
                      }}
                    >
                      Remove demo
                    </KsButton>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {demos && demos.length > 1 && (
        <nav className="ks-template-view__demos-container">
          <h4>Demos</h4>
          <div className="ks-template-view__demos">
            {demos.map((aDemo, i) => (
              <figure
                className={`ks-template-view__demos__item ${
                  demoIndex === i ? 'ks-template-view__demos__item--active' : ''
                }`}
                key={aDemo.id}
                style={{ width: '200px' }}
              >
                <figcaption title={aDemo.description}>{aDemo.title}</figcaption>
                <TemplateThumbnail
                  patternId={id}
                  templateId={templateId}
                  assetSetId={assetSetId}
                  demo={aDemo}
                  renderedWidth={demoWidth > 200 ? demoWidth : 200}
                  actualWidth={200}
                  handleSelection={() => {
                    history.push(
                      `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aDemo.id}`,
                    );
                    setDemo(aDemo);
                  }}
                />
              </figure>
            ))}
          </div>
        </nav>
      )}
      <details className="ks-details" open>
        <summary>Code Details</summary>
        {isCodeBlockShown && (
          <div style={{ marginBottom: '1rem' }}>
            <TemplateCodeBlock templateInfo={templateInfo} />
          </div>
        )}
        {isReadmeShown && readme && (
          <MdBlock
            md={readme}
            key={`${id}-${templateId}`}
            isEditable={permissions.includes('write')}
            title="Documentation (not wired up to save right now)"
            handleSave={newReadme => {
              // @todo save it
              console.log('handleSave on readme called', newReadme);
            }}
          />
        )}
        {isVerbose && hasSchema && (
          <>
            <div>
              <h4>Properties</h4>
              <p>
                The following properties make up the data that defines each
                instance of this component.
              </p>
              <Details open>
                <summary>Props Table</summary>
                <LoadableSchemaTable schema={schema} />
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
        {isVerbose && spec.slots && (
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
      </details>
    </article>
  );
};

export default TemplateView;
