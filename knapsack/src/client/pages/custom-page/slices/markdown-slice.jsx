import React from 'react';
import MdBlock from '../../../components/md-block';

// @todo remove this and fix
/* eslint-disable react/prop-types */

export const markdownSlice = {
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
        rows: 5,
      },
    },
  },
  initialData: {
    md: 'Some **markdown** here',
  },
};
