import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { SchemaForm } from '@knapsack/design-system';
import TemplateView, {
  Props as TemplateViewProps,
} from '../../pattern-view/template-view';
import { gqlQuery } from '../../../data';
import { Slice, SliceRenderParams } from './types';
import { useSelector } from '../../../store';

type Data = {
  patternId?: string;
  templateId?: string;
  options?: {
    demoSize?: TemplateViewProps['demoSize'];
    showReadme?: TemplateViewProps['isReadmeShown'];
    showSchemaForm?: TemplateViewProps['isSchemaFormShown'];
  };
};

function PatternTemplateSlice({
  isEditing,
  setSliceData,
  data: sliceData,
}: SliceRenderParams<Data>) {
  const [formData, setFormData] = useState(
    sliceData || { patternId: '', templateId: '', options: {} },
  );
  const patterns = useSelector(s => Object.values(s.patternsState.patterns));

  if (patterns.length === 0) return <div>Loading...</div>;

  const { patternId, templateId, options } = formData;
  const { showReadme, demoSize, showSchemaForm } = options;

  const schemaProps: any = {
    patternId: {
      type: 'string',
      title: 'Pattern',
      enum: patterns.map(p => p.id),
      enumNames: patterns.map(p => p.title),
    },
  };

  if (patternId) {
    const { templates } = patterns.find(p => p.id === patternId);
    schemaProps.templateId = {
      type: 'string',
      title: 'Template',
      enum: templates.map(t => t.id),
      enumNames: templates.map(t => t.title),
      default: templates.map(t => t.id)[0],
    };
  }

  schemaProps.options = {
    type: 'object',
    title: 'Display Options',
    properties: {
      showReadme: {
        type: 'boolean',
        title: 'Show Readme',
        default: true,
      },
      showSchemaForm: {
        type: 'boolean',
        title: 'Show Schema Form',
        default: true,
      },
      demoSize: {
        type: 'string',
        title: 'Demo Size',
        enum: ['s', 'm', 'l', 'full'],
        enumNames: ['Small', 'Medium', 'Large', 'Full'],
        default: 'l',
      },
    },
  };

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
            classNames: 'ks-rjsf-custom-object-grid-3',
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
          <TemplateView
            templateId={templateId}
            id={patternId}
            isVerbose={false}
            isReadmeShown={showReadme}
            demoSize={demoSize}
            isTitleShown={false}
            isSchemaFormShown={showSchemaForm}
          />
        )}
      </div>
    </div>
  );
}

export const patternTemplateSlice: Slice<Data> = {
  id: 'pattern-template-slice',
  title: 'Pattern Template',
  description: 'Render a Pattern Template',
  render: props => <PatternTemplateSlice {...props} />,
};
