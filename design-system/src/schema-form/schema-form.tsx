import React from 'react';
import Form, { FormProps, FieldProps } from 'react-jsonschema-form';
import uuid from 'uuid/v4';
// import { JSONSchema7 } from 'json-schema';
// import { JsonSchemaObject } from '@knapsack/core/src/types';
import { KsButton, KsTextField } from '../atoms';
import './schema-form.css';
import ObjectFieldTemplate from './custom-templates/custom-object';
import CustomArrayField from './custom-templates/array-field';
import CustomField from './custom-templates/custom-field';
import CheckboxWidget from './custom-templates/checkbox-widget';
import CheckboxesWidget from './custom-templates/checkboxes-widget';

type Props<T> = Omit<FormProps<T>, 'schema'> & {
  // formData: T;
  schema: any;
  isDebug?: boolean;
  isInline?: boolean;
  hasSubmit?: boolean;
  submitText?: string;
  className?: string;
  children?: React.ReactNode;
};

const FunctionField: React.FC<FieldProps> = (props: FieldProps) => {
  // console.log({ props });
  return (
    <>
      <KsTextField
        inputProps={{
          value: props.formData,
          onChange: event => props.onChange(event.target.value),
        }}
      />
    </>
  );
};

export const SchemaForm = ({
  schema,
  className = '',
  formData = {},
  hasSubmit = false,
  submitText = 'Submit',
  idPrefix = `ks-schema-form--${uuid()}`,
  isDebug = false,
  isInline = false,
  uiSchema = {},
  ...rest
}: Props<typeof formData>) => {
  Object.keys(schema.properties).forEach(key => {
    const value: any = schema.properties[key];
    if (value?.typeof && value.typeof === 'function') {
      uiSchema[key] = {
        'ui:field': 'FunctionField',
      };
    }
  });

  return (
    <div className={className}>
      <Form
        {...rest}
        formData={formData}
        schema={schema}
        uiSchema={uiSchema || undefined}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={CustomArrayField}
        FieldTemplate={CustomField}
        fields={{
          FunctionField,
        }}
        className={isInline ? 'ks-rjsf ks-rjsf--inline' : 'ks-rjsf'}
        widgets={{
          // can add any of our own OR replace any of these core ones: https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#customizing-the-default-fields-and-widgets
          CheckboxWidget,
          CheckboxesWidget,
        }}
      >
        {!hasSubmit && <span />}
        {hasSubmit && (
          <KsButton kind="primary" type="submit">
            {submitText}
          </KsButton>
        )}
      </Form>
    </div>
  );
};
