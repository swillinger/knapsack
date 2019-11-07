import React from 'react';
import Form from 'react-jsonschema-form';
import uuid from 'uuid/v4';
import { Button } from '../atoms';
import './schema-form.css';
import ObjectFieldTemplate from './custom-templates/custom-object';
import CustomArrayField from './custom-templates/array-field';
import CustomField from './custom-templates/custom-field';
import CheckboxWidget from './custom-templates/checkbox-widget';
import CheckboxesWidget from './custom-templates/checkboxes-widget';

type SchemaFormData = {
  // [k: string]: any;
  uiSchema: object;
  edit: boolean;
  idSchema: object;
  formData: object;
  errorsSchema: object;
  errors: any[];
};

type Props = {
  schema: object;
  uiSchema?: object;
  onChange?: (data: SchemaFormData) => void;
  onError?: (data: SchemaFormData) => void;
  onSubmit?: (data: SchemaFormData) => void;
  isDebug?: boolean;
  idPrefix?: string;
  isInline?: boolean;
  formData?: object;
  hasSubmit?: boolean;
  className?: string;
};

/* eslint-disable no-console */
export const SchemaForm: React.FC<Props> = ({
  schema,
  onChange = () => {},
  onError = () => {},
  onSubmit = () => {},
  className = '',
  formData = {},
  hasSubmit = false,
  idPrefix = `schema-form--${uuid()}`,
  isDebug = false,
  isInline = false,
  uiSchema = {},
  ...rest
}: Props) => {
  const handleChange = (data: SchemaFormData) => {
    if (isDebug) {
      console.debug('Form Data changed ', data);
    }
    onChange(data);
  };

  const handleSubmit = (data: SchemaFormData) => {
    if (isDebug) {
      console.debug('Form Data submitted ', data);
    }
    onSubmit(data);
  };

  const handleError = (data: SchemaFormData) => {
    if (isDebug) {
      console.debug('Form Data error ', data);
    }
    onError(data);
  };

  return (
    <div className={className}>
      <Form
        {...rest}
        formData={formData}
        schema={schema}
        uiSchema={uiSchema || undefined}
        onSubmit={handleSubmit}
        onError={handleError}
        onChange={handleChange}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={CustomArrayField}
        FieldTemplate={CustomField}
        className={isInline ? 'rjsf rjsf--inline' : 'rjsf'}
        widgets={{
          // can add any of our own OR replace any of these core ones: https://github.com/mozilla-services/react-jsonschema-form/tree/master/src/components/widgets
          CheckboxWidget,
          CheckboxesWidget,
        }}
      >
        {!hasSubmit && <span />}
        {hasSubmit && (
          <Button primary type="submit">
            Submit
          </Button>
        )}
      </Form>
    </div>
  );
};
