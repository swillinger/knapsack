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
import {
  SchemaForm,
  Details,
  Select,
  KsButton,
  Icon,
} from '@knapsack/design-system';
import { useHistory } from 'react-router-dom';
import ReactTable from 'react-table';
import cn from 'classnames';
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

  const [assetSetId, setAssetSetId] = useState(
    assetSets[0] ? assetSets[0].id : '',
  );
  const [templateInfo, setTemplateInfo] = useState<
    KsRenderResults & { url: string }
  >();

  const showSchemaForm = isSchemaFormShown && hasSchema;

  return (
    <article className="ks-template-view">
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

      {demos && demos.length > 1 && (
        <nav className="ks-template-view__demos-list">
          {demos.map((aDemo, i) => (
            <figure
              key={aDemo.id}
              className={cn(
                'ks-template-view__demos-list__item',
                demoIndex === i
                  ? 'ks-template-view__demos-list__item--active'
                  : '',
              )}
            >
              <div className="ks-template-view__demos-list__item__actions">
                {aDemo.description && (
                  <span title={aDemo.description}>
                    <Icon symbol="info" size="s" />
                  </span>
                )}
                {canEdit && (
                  <KsButton
                    kind="icon"
                    emphasis="danger"
                    icon="delete"
                    size="s"
                    flush
                    onClick={() => {
                      dispatch(
                        removeTemplateDemo({
                          patternId,
                          templateId,
                          demoId: aDemo.id,
                        }),
                      );
                    }}
                  >
                    Delete Demo
                  </KsButton>
                )}
              </div>
              <div className="ks-template-view__demos-list__item__thumbnail-wrap">
                <TemplateThumbnail
                  patternId={id}
                  templateId={templateId}
                  assetSetId={assetSetId}
                  demo={aDemo}
                  handleSelection={() => {
                    history.push(
                      `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aDemo.id}`,
                    );
                    setDemo(aDemo);
                  }}
                />
              </div>
              <figcaption>{aDemo.title}</figcaption>
            </figure>
          ))}
          {canEdit && (
            <span className="ks-template-view__demos-list__add-btn">
              <KsButton
                icon="add"
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
                Data Demo
              </KsButton>
            </span>
          )}
        </nav>
      )}

      <div
        className={cn(
          'ks-template-view__demo-editor',
          (showSchemaForm ? demoSize : 'full') === 'full'
            ? 'ks-template-view__demo-editor--full'
            : '',
          demos && demos.length > 1
            ? 'ks-template-view__demo-editor--has-demos'
            : '',
        )}
      >
        <div
          className="ks-template-view__demo-editor__stage"
          style={{
            width: calculateDemoStageWidth(showSchemaForm ? demoSize : 'full'),
          }}
        >
          <span className="ks-template-view__demo-editor__stage__open-btn">
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
            className="ks-template-view__demo-editor__schema"
            style={{
              width: calculateSchemaFormWidth(demoSize),
            }}
          >
            <div className="ks-template-view__demo-editor__schema__inner">
              <header className="ks-template-view__demo-editor__schema__header">
                <div className="ks-template-view__demo-editor__schema__title">
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
                  {canEdit && (
                    <KsButton
                      kind="primary"
                      size="s"
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
                  )}
                </div>
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
            </div>
          </div>
        )}
      </div>

      {isCodeBlockShown && (
        <div className="ks-template-view__code-block-wrapper">
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
          <div className="ks-template-view__properties-table">
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
