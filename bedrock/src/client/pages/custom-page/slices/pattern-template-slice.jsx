import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import SchemaForm from '@basalt/bedrock-schema-form';
import PatternStage from '../../pattern-view/pattern-stage';
import { gqlQuery } from '../../../data';

// @todo remove this and fix
/* eslint-disable react/prop-types, class-methods-use-this */

function PatternTemplateSlice({
  isEditing,
  setSliceData,
  data: sliceData = {},
}) {
  const [formData, setFormData] = useState({
    patternId: sliceData.patternId,
    templateId: sliceData.templateId,
  });
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    gqlQuery({
      gqlQueryObj: gql`
        {
          patterns {
            id
            meta {
              title
            }
            templates {
              id
              title
              schema
              demoDatas
              uiSchema
              demoSize
            }
          }
        }
      `,
    })
      .then(({ data }) => {
        setPatterns(data.patterns);
      })
      .catch(console.log.bind(console));
  }, []);
  if (patterns.length === 0) return <div>Loading...</div>;

  const { patternId, templateId } = formData;
  let templateSchema;
  let templateData;
  let hasSchema = false;

  const schemaProps = {
    patternId: {
      type: 'string',
      enum: patterns.map(p => p.id),
      enumNames: patterns.map(p => p.meta.title),
    },
  };

  if (patternId) {
    const { templates } = patterns.find(p => p.id === patternId);
    schemaProps.templateId = {
      type: 'string',
      enum: templates.map(t => t.id),
      enumNames: templates.map(t => t.title),
      default: templates.map(t => t.id)[0],
    };
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      templateData = template.demoDatas ? template.demoDatas[0] : {};
      if (template.schema) {
        templateSchema = template.schema;
        hasSchema = true;
      }
    }
  }

  return (
    <div>
      {isEditing && (
        <SchemaForm
          formData={formData}
          schema={{
            type: 'object',
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: schemaProps,
          }}
          uiSchema={{
            classNames: 'rjsf-custom-object-grid-2',
            tokens: {
              tags: {
                'ui:widget': 'checkboxes',
                'ui:options': {
                  inline: true,
                },
              },
            },
          }}
          onChange={({ formData: newFormData }) => {
            if (newFormData.patternId === formData.patternId) {
              setFormData(newFormData);
              setSliceData(newFormData);
            } else {
              const { templates } = patterns.find(
                p => p.id === newFormData.patternId,
              );
              setFormData({
                ...newFormData,
                templateId: templates.map(t => t.id)[0],
              });
              setSliceData({
                ...newFormData,
                templateId: templates.map(t => t.id)[0],
              });
            }
          }}
        />
      )}

      <div>
        {patternId && templateId && (
          <PatternStage
            templateId={templateId}
            patternId={patternId}
            schema={templateSchema}
            data={templateData}
            hasSchema={hasSchema}
            handleNewData={() => {}}
          />
        )}
      </div>
    </div>
  );
}

export const patternTemplateSlice = {
  id: 'pattern-template-slice',
  title: 'Pattern Template',
  description: 'Render a Pattern Template',
  render: PatternTemplateSlice,
};
