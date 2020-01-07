/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState } from 'react';
import {
  KsSelect,
  SelectOptionProps,
  SchemaForm,
} from '@knapsack/design-system';
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

/**
 * If this returns `false`, then the component renders again. Used by `React.memo()`
 */
function areEqual(
  prevProps: PropEditorProps,
  nextProps: PropEditorProps,
): boolean {
  return JSON.stringify(prevProps.prop) === JSON.stringify(nextProps.prop);
}

export const KsPropEditor: React.FC<PropEditorProps> = React.memo(
  ({ prop, handleChange }: PropEditorProps) => {
    // @todo get this info from the renderer; assuming just React for now
    const isFunctionPropOk = useSelector(
      s => s.ui.currentTemplateRenderer === 'react',
    );

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
        default: {
          type: 'string',
          title: 'Default Value',
        },
      },
    };
    const { data } = prop;

    const [selectedOption, setSelectedOption] = useState<SelectOptionProps>({
      value: prop.type,
      label: sentenceCase(prop.type),
    });

    const formData = {
      isRequired: prop.isRequired ?? false,
      ...data,
    };
    switch (prop.type) {
      case PropTypeNames.string: {
        //
        break;
      }
      case PropTypeNames.options: {
        // @ts-ignore
        schema.properties.default.enum = formData.enum;
        if (prop.isRequired) {
          // const [firstOption] = formData.options;
          // formData.defaultValue = formData.defaultValue ?? firstOption;
        } else {
          // schema.properties.defaultValue.enum = ['', ...formData.options];
        }
        schema.properties.enum = {
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
        schema.properties.default.type = 'boolean';
        break;
      }
      case PropTypeNames.number: {
        // @ts-ignore
        schema.properties.default.type = 'number';
        break;
      }
      case PropTypeNames.function: {
        schema.properties.tsType = {
          type: 'string',
          title: 'TypeScript Type',
          default: '() => void',
        };
        break;
      }
    }

    return (
      <div className="ks-prop-editor">
        <div className="ks-u-margin-top--s">
          <KsSelect
            label="Type"
            options={[
              PropTypeNames.string,
              PropTypeNames.number,
              PropTypeNames.boolean,
              PropTypeNames.options,
              PropTypeNames.arrayOfStrings,
              isFunctionPropOk ? PropTypeNames.function : null,
              // PropTypeNames.unknown, // @todo enable unknown/full edit mode
            ]
              .filter(Boolean)
              .map(propType => ({
                value: propType,
                title: sentenceCase(propType),
              }))}
            value={selectedOption}
            size="s"
            handleChange={option => {
              const { title, description } = prop.data;
              const newLocal: PropTypeData = {
                ...prop,
                type: option.value as any,
                // @ts-ignore
                data: {
                  title,
                  description,
                },
              };
              setSelectedOption(option);
              switch (newLocal.type) {
                case PropTypeNames.string: {
                  newLocal.data.type = 'string';
                  break;
                }
                case PropTypeNames.options: {
                  newLocal.data.type = 'string';
                  newLocal.data.enum = [];
                  break;
                }
                case PropTypeNames.boolean: {
                  newLocal.data.type = 'boolean';
                  break;
                }
                case PropTypeNames.number: {
                  newLocal.data.type = 'number';
                  break;
                }
                case PropTypeNames.function: {
                  newLocal.data.typeof = 'function';
                  newLocal.data.tsType = '() => void';
                  break;
                }
              }
              handleChange(newLocal);
            }}
          />
        </div>

        <div className="ks-u-margin-top--s">
          <SchemaForm
            schema={schema}
            formData={formData}
            liveValidate
            uiSchema={{
              enum: {
                'ui:detailsWrap': false,
                'ui:emptyValue': '',
              },
              description: {
                'ui:widget': 'textarea',
                'ui:options': {
                  rows: 2,
                },
              },
              // tsType: {
              //   'ui:field': 'FunctionField',
              // },
            }}
            onChange={({ formData: newFormData }) => {
              const { isRequired, ...rest } = newFormData;
              const newData: PropTypeDataBase = {
                ...prop,
                isRequired,
                data: {
                  ...prop.data,
                  ...rest,
                },
              };
              handleChange(newData);
            }}
          />
        </div>
        <details>
          <pre>
            <code>{JSON.stringify(prop.data, null, '  ')}</code>
          </pre>
        </details>
      </div>
    );
  },
  areEqual,
);
