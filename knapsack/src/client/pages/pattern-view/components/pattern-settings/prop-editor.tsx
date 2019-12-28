/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { Select, SchemaForm, KsButton } from '@knapsack/design-system';
import {
  PropTypeNames,
  PropTypeData,
  JsonSchemaObject,
  PropTypeDataBase,
} from '@knapsack/core/types';
import { sentenceCase } from 'change-case';
import { useSelector } from '../../../../store';
import './prop-editor.scss';

type PropEditorProps = {
  prop: PropTypeData;
  handleChange: (newPropData: PropTypeDataBase) => void;
};

export const KsPropEditor: React.FC<PropEditorProps> = ({
  prop,
  handleChange,
}: PropEditorProps) => {
  // @todo get this info from the renderer; assuming just React for now
  const isFunctionPropOk = useSelector(
    s => s.ui.currentTemplateRenderer === 'react',
  );
  const defaultValue: Record<any, any> = {
    type: 'string',
    title: 'Default Value',
  };
  const schema: JsonSchemaObject = {
    type: 'object',
    required: [],
    properties: {
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
      // @ts-ignore
      defaultValue,
    },
  };
  const { data } = prop;
  const formData: Record<string, any> = {
    isRequired: prop.isRequired,
    description: data.description,
    defaultValue: data.default,
  };
  switch (prop.type) {
    case PropTypeNames.string: {
      //
      break;
    }
    case PropTypeNames.options: {
      formData.options = prop.data.enum ?? [];
      // @ts-ignore
      schema.properties.defaultValue.enum = formData.options;
      if (prop.isRequired) {
        // const [firstOption] = formData.options;
        // formData.defaultValue = formData.defaultValue ?? firstOption;
      } else {
        // schema.properties.defaultValue.enum = ['', ...formData.options];
      }
      schema.properties.options = {
        type: 'array',
        title: 'Options',
        items: {
          type: 'string',
        },
      };
      break;
    }
    case PropTypeNames.boolean: {
      // @ts-ignore
      schema.properties.defaultValue.type = 'boolean';
      break;
    }
    case PropTypeNames.number: {
      // @ts-ignore
      schema.properties.defaultValue.type = 'number';
      break;
    }
  }

  return (
    <div className="ks-prop-editor">
      <div className="ks-u-margin-top--s">
        <Select
          label="Type"
          isLabelInline={false}
          items={[
            PropTypeNames.string,
            PropTypeNames.number,
            PropTypeNames.boolean,
            PropTypeNames.options,
            PropTypeNames.arrayOfStrings,
            isFunctionPropOk ? PropTypeNames.function : null,
            PropTypeNames.unknown,
          ]
            .filter(Boolean)
            .map(propType => ({
              value: propType,
              title: sentenceCase(propType),
            }))}
          value={prop.type}
          size="s"
          handleChange={value => {
            handleChange({
              ...prop,
              type: value,
              data: {}, // resets `data`
            });
          }}
        />
      </div>

      <div className="ks-u-margin-top--s">
        <SchemaForm
          schema={schema}
          formData={formData}
          liveValidate
          uiSchema={{
            options: {
              'ui:detailsWrap': false,
              'ui:emptyValue': '',
            },
            description: {
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 2,
              },
            },
          }}
          onChange={({ formData: newFormData }) => {
            const {
              isRequired,
              description,
              options,
              defaultValue: newDefaultValue,
              title,
            } = newFormData;
            const newData: PropTypeDataBase = {
              ...prop,
              isRequired,
              data: {
                ...prop.data,
                title,
                description,
                default: newDefaultValue,
              },
            };
            if (options) newData.data.enum = options;
            handleChange(newData);
          }}
        />
      </div>
    </div>
  );
};
