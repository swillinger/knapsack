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

import React, { useState, useRef } from 'react';
import { CodeBlock } from '@knapsack/design-system';
import { useHistory } from 'react-router-dom';
import deepEqual from 'deep-equal';
import {
  updateTemplateInfo,
  useDispatch,
  useSelector,
  updateTemplateDemo,
} from '../../store';
import MdBlock from '../../components/md-block';
// import DosAndDonts from '../../components/dos-and-donts';
import './template-view.scss';
import './shared/demo-grid-controls.scss';
import {
  DataDemo,
  isDataDemo,
  isTemplateDemo,
  KnapsackTemplateDemo,
} from '../../../schemas/patterns';
import { KsRenderResults } from '../../../schemas/knapsack-config';
import { BASE_PATHS } from '../../../lib/constants';
import {
  CurrentTemplateContext,
  CurrentTemplateData,
} from './current-template-context';
import { TemplateHeader, KsDemoStage, KsSpecDocs } from './components';
import { KsTemplateDemos } from './components/template-demos';

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
  demoSize,
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
  const isLocalDev = useSelector(store => store.userState.isLocalDev);
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

  const {
    spec = {},
    title,
    assetSetIds: templateAssetSetIds,
    demosById,
    statusId,
  } = template;
  const originalDemos = useRef(demosById); // used to reset demo

  const { props: schema } = spec;
  const status = allStatuses.find(p => p.id === statusId);
  const hasSchema = !!(Object.keys(schema?.properties || {}).length > 0);
  const readme = ''; // @todo

  const backupDemo: DataDemo = {
    type: 'data',
    id: 'blank',
    description: '',
    title: 'Blank',
    data: {
      props: {},
      slots: {},
    },
  };

  const demos = template?.demos?.map(d => demosById[d]) ?? [];
  const [firstDemo] = demos;

  const demo =
    demosById && demoId ? demosById[demoId] : firstDemo ?? backupDemo;

  if (demoId && !demosById[demoId]) {
    history.replace(`${BASE_PATHS.PATTERN}/${patternId}/${templateId}`);
  }

  const isCodeBlockEditable = demo && isTemplateDemo(demo) && isLocalDev;
  const assetSetIds = templateAssetSetIds ?? globalAssetSetIds;
  const assetSets = assetSetIds.map(assetSetId => ({
    id: assetSetId,
    ...allAssetSets[assetSetId],
  }));
  const [assetSetId, setAssetSetId] = useState(
    assetSets[0] ? assetSets[0].id : '',
  );
  const [templateInfo, setTemplateInfo] = useState<
    KsRenderResults & { url: string }
  >();

  const showSchemaForm = isSchemaFormShown && hasSchema;

  const currentTemplateData: CurrentTemplateData = {
    patternId,
    pattern,
    templateId,
    template,
    demo,
    demos,
    templateInfo,
    spec,
    canEdit,
    isLocalDev,
    title,
    hasSchema,
    assetSetId,
  };

  const codeBlock = (
    <div className="ks-template-view__code-block-wrapper">
      <CodeBlock
        items={[
          templateInfo?.usage
            ? {
                id: 'usage',
                name: 'Usage',
                code: templateInfo.usage,
                language: templateInfo.templateLanguage,
                // isEditable: isCodeBlockEditable,
                isEditable: false,
                // handleChange: newCode => {
                //   // socket.send(
                //   //   JSON.stringify({
                //   //     patternId,
                //   //     templateId,
                //   //     demoId: demo.id,
                //   //     code: newCode,
                //   //   }),
                //   // );
                //   window
                //     .fetch('/api/tmp-save', {
                //       method: 'POST',
                //       headers: {
                //         'Content-Type': 'application/json',
                //         Accept: 'application/json',
                //       },
                //       body: JSON.stringify({
                //         patternId,
                //         templateId,
                //         demoId: demo.id,
                //         code: newCode,
                //       }),
                //     })
                //     .then(res => res.json())
                //     .then(x => {
                //       console.log(x);
                //     });
                //   // console.log('new code', newCode);
                // },
              }
            : null,
          // {
          //   id: 'templateSrc',
          //   name: 'Template Source',
          // },
          templateInfo?.html
            ? {
                id: 'html',
                name: 'HTML',
                language: 'html',
                code: templateInfo.html,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );

  return (
    <CurrentTemplateContext.Provider value={currentTemplateData}>
      <article className="ks-template-view">
        <div className="ks-template-view__overview-wrapper">
          <TemplateHeader
            assetSets={assetSets}
            status={status}
            isTitleShown={!isVerbose && isTitleShown}
            handleAssetSetChange={newAssetSet => {
              setAssetSetId(newAssetSet.value);
            }}
            handleStatusChange={newStatus => {
              dispatch(
                updateTemplateInfo({
                  templateId,
                  patternId,
                  template: {
                    statusId: newStatus.value,
                  },
                }),
              );
            }}
          />

          <KsTemplateDemos />

          <KsDemoStage
            demoSize={demoSize}
            isFormVisible={showSchemaForm}
            key={demo.id}
            // codeBlock={codeBlock}
            setTemplateInfo={info => {
              if (!deepEqual(info, templateInfo)) {
                setTemplateInfo(info);
              }
            }}
            handlePropsChange={props => {
              if (isDataDemo(demo)) {
                dispatch(
                  updateTemplateDemo({
                    patternId,
                    templateId,
                    demo: {
                      ...demo,
                      data: {
                        ...demo.data,
                        props,
                      },
                    },
                  }),
                );
              }
            }}
            handleSlotsChange={slotsData => {
              if (isDataDemo(demo)) {
                dispatch(
                  updateTemplateDemo({
                    patternId,
                    templateId,
                    demo: {
                      ...demo,
                      data: {
                        ...demo.data,
                        slots: slotsData,
                      },
                    },
                  }),
                );
              }
            }}
            handleDemoReset={() => {
              const originalDemo = originalDemos.current[demo?.id] ?? {
                ...demo,
                data: {
                  props: {},
                  slots: {},
                },
              };
              dispatch(
                updateTemplateDemo({
                  patternId,
                  templateId,
                  demo: originalDemo,
                }),
              );
            }}
          />
        </div>
        {isCodeBlockShown && codeBlock}
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
        {isVerbose && <KsSpecDocs />}
      </article>
    </CurrentTemplateContext.Provider>
  );
};

export default TemplateView;
