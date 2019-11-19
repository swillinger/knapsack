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
import { SchemaForm, Details, Select, Button } from '@knapsack/design-system';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import shortid from 'shortid';
import ReactTable from 'react-table';
import {
  useSelector,
  updatePattern,
  useDispatch,
  updateTemplateDemo,
  updatePatternInfo,
  addTemplateDataDemo,
  removeTemplateDemo,
} from '../../store';
import MdBlock from '../../components/md-block';
import Template from '../../components/template';
import TemplateCodeBlock from './template-code-block';
import {
  LoadableSchemaTable,
  LoadableVariationDemo,
} from '../../loadable-components';
// import DosAndDonts from '../../components/dos-and-donts';
import { getTemplateUrl } from '../../data';
import { TemplateHeader } from './template-header';
import './template-view.scss';
import './shared/demo-grid-controls.scss';
import { isDataDemo, isTemplateDemo } from '../../../schemas/patterns';
import { TemplateThumbnail } from '../../components/template-thumbnail';
import { Tabs } from '../../components/tabs';
import { InlineEditText } from '../../components/inline-edit';

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

  const [demoIndex, setDemoIndex] = useState(0);
  const [demo, setDemo] = useState(demos[demoIndex]);
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

  const showSchemaForm = isSchemaFormShown && hasSchema;

  return (
    <article className="ks-template-view">
      <div className="ks-template-view__overview-wrapper">
        <TemplateHeader
          title={title}
          assetSets={assetSets}
          demoDatasLength={demos.length}
          demoDataIndex={demoIndex}
          status={status}
          isTitleShown={!isVerbose && isTitleShown}
          handleOpenNewTabClick={() => {
            getTemplateUrl({
              patternId: id,
              templateId,
              demo,
              isInIframe: false,
              wrapHtml: true,
              assetSetId,
            })
              .then(externalUrl => {
                window.open(externalUrl, '_blank');
              })
              .catch(console.log.bind(console));
          }}
          handleAssetSetChange={newAssetSetId => {
            setAssetSetId(newAssetSetId);
          }}
          handleDemoPrevClick={() => {
            setDemoIndex(prev => {
              const newIndex = prev - 1;
              setDemo(demos[newIndex]);
              return newIndex;
            });
            // setDataState(prevState => ({
            //   demoDataIndex: prevState.demoDataIndex - 1,
            //   data: demoDatas[prevState.demoDataIndex - 1],
            // }));
          }}
          handleDemoNextClick={() => {
            setDemoIndex(prev => {
              const newIndex = prev + 1;
              setDemo(demos[newIndex]);
              return newIndex;
            });
            // setDataState(prevState => ({
            //   demoDataIndex: prevState.demoDataIndex + 1,
            //   data: demoDatas[prevState.demoDataIndex + 1],
            // }));
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
            <Template
              patternId={id}
              templateId={templateId}
              assetSetId={assetSetId}
              demo={demo}
              isResizable
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
                  <h4>
                    <InlineEditText
                      text={demo.title}
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
                  </h4>
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
                                // @todo ensure it saves
                                setDemo(prevDemo => {
                                  if (isDataDemo(prevDemo)) {
                                    return {
                                      ...prevDemo,
                                      data: {
                                        ...prevDemo.data,
                                        props: formData,
                                      },
                                    };
                                  }
                                });
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
                            const { slots } = spec;
                            if (!demo.data.slots) {
                              // @todo refactor
                              setDemo(prevDemo => {
                                if (isDataDemo(prevDemo)) {
                                  return {
                                    ...prevDemo,
                                    data: {
                                      ...prevDemo.data,
                                      slots: {},
                                    },
                                  };
                                }
                              });
                              return;
                            }

                            return (
                              <>
                                <h4>Slots</h4>
                                {Object.keys(slots).map(slotName => {
                                  const slotDef = slots[slotName];

                                  const items = [{ title: 'None', value: '' }];
                                  slotDef.allowedPatternIds.forEach(
                                    allowedPatternId => {
                                      patterns[
                                        allowedPatternId
                                      ].templates.forEach(t => {
                                        if (
                                          t.templateLanguageId ===
                                          template.templateLanguageId
                                        ) {
                                          t.demos.forEach(demoId => {
                                            const {
                                              title: demoTitle,
                                            } = t.demosById[demoId];
                                            items.push({
                                              title: `${patterns[allowedPatternId].title} - ${demoTitle}`,
                                              value: JSON.stringify({
                                                patternId: allowedPatternId,
                                                templateId: t.id,
                                                demoId,
                                              }),
                                            });
                                          });
                                        }
                                      });
                                    },
                                  );
                                  if (!isDataDemo(demo)) return;

                                  return (
                                    <div key={slotName}>
                                      <h5>{slotName}</h5>
                                      <Select
                                        items={items}
                                        value={JSON.stringify(
                                          demo.data.slots[slotName]
                                            ? demo.data.slots[slotName][0]
                                            : '',
                                        )}
                                        handleChange={newSlotInfo => {
                                          const newSlotData:
                                            | {
                                                patternId: string;
                                                templateId: string;
                                                demoId: string;
                                              }[]
                                            | [] = newSlotInfo
                                            ? [JSON.parse(newSlotInfo)]
                                            : [];
                                          setDemo(prevDemo => {
                                            if (isDataDemo(prevDemo)) {
                                              return {
                                                ...prevDemo,
                                                data: {
                                                  ...prevDemo.data,
                                                  slots: {
                                                    ...prevDemo.data.slots,
                                                    [slotName]: newSlotData,
                                                  },
                                                },
                                              };
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            );
                          },
                        }
                      : null,
                  ].filter(Boolean)}
                />
                {canEdit && (
                  <>
                    <hr />
                    <Button
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
                    </Button>
                    <Button
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
                    </Button>
                    <Button
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
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {demos && demos.length > 1 && (
        <nav className="ks-template-view__demo-list">
          <h4>Demos</h4>
          <div className="ks-template-view__demo-items">
            {demos.map((aDemo, i) => (
              <figure
                className={`ks-template-view__demo-item ${
                  demoIndex === i ? 'ks-template-view__demo-item--active' : ''
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
                    setDemo(aDemo);
                  }}
                />
              </figure>
            ))}
          </div>
        </nav>
      )}
      {/* {isCodeBlockShown && false && ( */}
      {/*  <div style={{ marginBottom: '1rem' }}> */}
      {/*    <TemplateCodeBlock */}
      {/*      patternId={id} */}
      {/*      templateId={templateId} */}
      {/*      data={dataState.data} */}
      {/*    /> */}
      {/*  </div> */}
      {/* )} */}

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
    </article>
  );
};

export default TemplateView;
