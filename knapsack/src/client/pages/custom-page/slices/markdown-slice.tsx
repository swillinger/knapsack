import React from 'react';
import MdBlock from '../../../components/md-block';
import { Slice } from './types';

type Data = {
  md: string;
};

export const markdownSlice: Slice<Data> = {
  id: 'markdown-slice',
  title: 'Markdown',
  render: props => <MdBlock md={props.data.md} key={props.data.md} />,
  schema: {
    title: 'Markdown',
    type: 'object',
    required: ['md'],
    properties: {
      md: {
        type: 'string',
        title: 'Markdown content',
      },
    },
  },
  uiSchema: {
    md: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 15,
      },
    },
  },
  initialData: {
    md: 'Some **markdown** here',
  },
};
