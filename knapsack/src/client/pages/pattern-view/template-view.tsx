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
import { SchemaForm, Details } from '@knapsack/design-system';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useSelector } from '../../store';
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

const updateReadme = gql`
  mutation UpdateReadme($id: ID!, $templateId: ID!, $readme: String!) {
    setPatternTemplateReadme(
      id: $id
      templateId: $templateId
      readme: $readme
    ) {
      id
      templates {
        id
        doc
      }
    }
  }
`;

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
  const permissions = useSelector(store => store.userState.role.permissions);
  const pattern = useSelector(store => {
    const thePattern = store.patternsState.patterns.find(p => p.id === id);
    if (!thePattern) {
      throw new Error(`The pattern id ${id} cannont be found in Redux Store`);
    }
    return thePattern;
  });

  const { templates } = pattern;

  const {
    schema,
    uiSchema,
    isInline,
    doc: readme,
    title,
    demoDatas = [],
    assetSets = [],
  } = templates.find(t => t.id === templateId);

  const hasSchema = !!(
    schema &&
    schema.properties &&
    Object.keys(schema.properties).length > 0
  );

  const [state, setState] = useState({
    demoDataIndex: 0,
    data: demoDatas[0],
  });

  const [assetSetId, setAssetSetId] = useState(
    assetSets[0] ? assetSets[0].id : '',
  );

  const { demoDataIndex, data } = state;

  const showSchemaForm = isSchemaFormShown && hasSchema;

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

  return (
    <article className="template-view">
      <div className="template-view__overview-wrapper">
        <TemplateHeader
          title={title}
          assetSets={assetSets}
          demoDatas={demoDatas}
          demoDataIndex={demoDataIndex}
          isTitleShown={!isVerbose && isTitleShown}
          handleOpenNewTabClick={() => {
            getTemplateUrl({
              patternId: id,
              templateId,
              data,
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
            setState(prevState => ({
              demoDataIndex: prevState.demoDataIndex - 1,
              data: demoDatas[prevState.demoDataIndex - 1],
            }));
          }}
          handleDemoNextClick={() => {
            setState(prevState => ({
              demoDataIndex: prevState.demoDataIndex + 1,
              data: demoDatas[prevState.demoDataIndex + 1],
            }));
          }}
        />

        <div
          className="template-view__demo-grid"
          style={{
            display:
              (showSchemaForm ? demoSize : 'full') === 'full'
                ? 'block'
                : 'flex',
          }}
        >
          <div
            className="template-view__demo-stage"
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
              data={data}
              isResizable
            />
          </div>
          {showSchemaForm && (
            <div
              className="template-view__schema-form"
              style={{
                width: calculateSchemaFormWidth(demoSize),
              }}
            >
              <div className="template-view__schema-form__inner">
                <h4>Edit Form</h4>
                <SchemaForm
                  schema={schema}
                  formData={data}
                  onChange={({ formData }) => {
                    setState(prevState => ({
                      ...prevState,
                      data: formData,
                    }));
                  }}
                  uiSchema={uiSchema}
                  isInline={isInline}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isCodeBlockShown && (
        <div style={{ marginBottom: '1rem' }}>
          <TemplateCodeBlock
            patternId={id}
            templateId={templateId}
            data={data}
          />
        </div>
      )}

      {isReadmeShown && readme && (
        <Mutation
          mutation={updateReadme}
          // refetchQueries={() => [
          //   {
          //     query: patternQuery,
          //     variables: {
          //       id,
          //     },
          //   },
          // ]}
        >
          {setPatternTemplateReadme => {
            // {(setPatternTemplateReadme, { error: mutationError }) => {
            // if (mutationError)
            //   return (
            //     <StatusMessage message={mutationError.message} type="error" />
            //   );
            return (
              <MdBlock
                md={readme}
                key={`${id}-${templateId}`}
                isEditable={permissions.includes('write')}
                title="Documentation"
                handleSave={newReadme => {
                  setPatternTemplateReadme({
                    variables: {
                      id,
                      templateId,
                      readme: newReadme,
                    },
                  });
                }}
              />
            );
          }}
        </Mutation>
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

          <LoadableVariationDemo
            schema={schema}
            templateId={templateId}
            patternId={id}
            data={demoDatas[demoDataIndex]}
            key={`${id}-${templateId}-${demoDataIndex}`}
          />
        </>
      )}
    </article>
  );
};

export default TemplateView;
