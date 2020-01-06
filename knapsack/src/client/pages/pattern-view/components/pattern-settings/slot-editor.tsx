import React, { useState, useCallback, useRef } from 'react';
import { JsonSchemaObject } from '@knapsack/core/types';
import { SchemaForm } from '@knapsack/design-system';
import { SlotData } from './shared';
import { useSelector } from '../../../../store';

type SlotEditorProps = {
  slot: SlotData;
  handleChange: (newSlotData: SlotData) => void;
};

export const KsSlotEditor: React.FC<SlotEditorProps> = ({
  slot,
  handleChange,
}: SlotEditorProps) => {
  const { currentTemplateRenderer } = useSelector(s => s.ui);
  const compatiblePatternIds: string[] = useSelector(s =>
    Object.values(s.patternsState.patterns)
      .filter(({ templates }) =>
        templates.some(
          ({ templateLanguageId }) =>
            templateLanguageId === currentTemplateRenderer,
        ),
      )
      .map(({ id }) => id),
  );

  const properties: Record<keyof SlotData['data'], any> = {
    title: {
      type: 'string',
      title: 'Title',
    },
    description: {
      type: 'string',
      title: 'Description',
    },
    isRequired: {
      type: 'boolean',
      title: 'Required?',
    },
    disallowText: {
      type: 'boolean',
      title: 'Disallow Text?',
      description:
        'Prevent simple text in this slot? Would then only allow other patterns inside.',
    },
    allowedPatternIds: {
      type: 'array',
      title: 'Allowed Patterns',
      description: 'What other patterns are allowed in this slot?',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: compatiblePatternIds,
      },
    },
  };
  const schema: JsonSchemaObject = {
    type: 'object',
    required: ['title'],
    properties,
  };
  const { data } = slot;

  return (
    <div className="ks-slot-editor">
      <SchemaForm
        schema={schema}
        formData={data}
        uiSchema={{
          allowedPatternIds: {
            'ui:widget': 'checkboxes',
            'ui:options': {
              inline: true,
            },
          },
          description: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 2,
            },
          },
        }}
        onChange={({ formData }) => {
          handleChange({
            ...slot,
            data: formData,
          });
        }}
      />
    </div>
  );
};
