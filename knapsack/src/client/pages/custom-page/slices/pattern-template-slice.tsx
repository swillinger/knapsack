import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { SchemaForm } from '@knapsack/design-system';
import TemplateView, {
  Props as TemplateViewProps,
} from '../../pattern-view/template-view';
import { Slice, SliceRenderParams } from './types';
import { useSelector } from '../../../store';

type Data = {
  patternId?: string;
  templateId?: string;
  demoId?: string;
  demoSize?: TemplateViewProps['demoSize'];
  showReadme?: TemplateViewProps['isReadmeShown'];
  showSchemaForm?: TemplateViewProps['isSchemaFormShown'];
};

function PatternTemplateSlice({
  canEdit,
  setSliceData,
  data: sliceData,
}: SliceRenderParams<Data>) {
  const [formData, setFormData] = useState(
    sliceData || {
      patternId: '',
      templateId: '',
      demoId: '',
      showReadme: false,
      demoSize: 'm',
      showSchemaForm: true,
    },
  );
  const patterns = useSelector(s => Object.values(s.patternsState.patterns));

  if (patterns.length === 0) return <div>Loading...</div>;

  const {
    patternId,
    templateId,
    demoId,
    showReadme,
    demoSize,
    showSchemaForm,
  } = formData;

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

  if (templateId) {
    const { templates } = patterns.find(p => p.id === patternId);
    const { demos, demosById } = templates.find(t => t.id === templateId);
    schemaProps.demoId = {
      type: 'string',
      title: 'Demo',
      enum: demos,
      enumNames: demos.map(dId => demosById[dId]?.title),
      default: demos[0] ?? '',
    };
  }

  if (showSchemaForm) {
    schemaProps.demoSize = {
      type: 'string',
      title: 'Demo Size',
      enum: ['s', 'm', 'l', 'full'],
      enumNames: ['Small', 'Medium', 'Large', 'Full'],
      default: 'l',
    };
  }

  schemaProps.showSchemaForm = {
    type: 'boolean',
    title: 'Show Schema Form',
    default: true,
  };

  return (
    <div>
      {canEdit && (
        <SchemaForm
          formData={formData}
          schema={{
            type: 'object',
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: schemaProps,
          }}
          isInline
          onChange={({ formData: newFormData }) => {
            const x: Data = {
              ...newFormData,
            };
            if (newFormData.patternId !== formData.patternId) {
              x.templateId = '';
              x.demoId = '';
            }
            if (!x.patternId) {
              x.patternId = patterns[0]?.id;
            }
            if (newFormData.templateId !== formData.templateId) {
              x.templateId = '';
            }
            const { templates } = patterns.find(p => p.id === x.patternId);
            if (!x.templateId) {
              x.templateId = templates[0]?.id;
              x.demoId = '';
            }
            if (!x.demoId) {
              const [firstDemoId] = templates.find(
                t => t.id === x.templateId,
              )?.demos;
              x.demoId = firstDemoId;
            }
            setFormData(x);
            setSliceData(x);
          }}
        />
      )}

      <div>
        {patternId && templateId && demoId && (
          <TemplateView
            templateId={templateId}
            id={patternId}
            demoId={demoId}
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
