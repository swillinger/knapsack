import React from 'react';
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

export const basic = () => <SchemaForm schema={basicSchema} />;

export const cardForm = () => <SchemaForm schema={bootstrapCardSchema} />;
export const cardFormInline = () => (
  <SchemaForm schema={bootstrapCardSchema} isInline />
);

export const kitchenSink = () => <SchemaForm schema={kitchenSinkSchema} />;
export const nested = () => <SchemaForm schema={nestedSchema} />;
