import React from 'react';
import { action } from '@storybook/addon-actions';
import { SchemaForm } from './schema-form';
import {
  bootstrapCardSchema,
  basicSchema,
  kitchenSinkSchema,
  nestedSchema,
} from '../demo-data';

export default {
  title: 'Components|SchemaForm',
  component: SchemaForm,
  decorators: [],
  parameters: {},
};

export const basic = () => (
  <SchemaForm schema={basicSchema} onChange={action('change')} />
);

export const cardForm = () => (
  <SchemaForm schema={bootstrapCardSchema} onChange={action('change')} />
);
export const cardFormInline = () => (
  <SchemaForm
    schema={bootstrapCardSchema}
    isInline
    onChange={action('change')}
  />
);

export const kitchenSink = () => (
  <SchemaForm schema={kitchenSinkSchema} onChange={action('change')} />
);
export const nested = () => (
  <SchemaForm schema={nestedSchema} onChange={action('change')} />
);
