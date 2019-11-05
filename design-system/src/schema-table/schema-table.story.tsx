import React from 'react';
import { SchemaTable } from './schema-table';
import {
  bootstrapCardSchema,
  basicSchema,
  kitchenSinkSchema,
  nestedSchema,
} from '../demo-data';

export default {
  title: 'Components|SchemaTable',
  component: SchemaTable,
  decorators: [],
  parameters: {},
};

export const basic = () => <SchemaTable schema={basicSchema} />;
export const card = () => <SchemaTable schema={bootstrapCardSchema} />;
export const kitchenSink = () => <SchemaTable schema={kitchenSinkSchema} />;
export const nested = () => <SchemaTable schema={nestedSchema} />;
