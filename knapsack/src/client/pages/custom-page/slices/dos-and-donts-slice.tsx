import React from 'react';
import DosAndDonts from '../../../components/dos-and-donts';
import { Slice } from './types';

type Data = {
  title: string;
  description: string;
  items: {
    image: string;
    caption?: string;
    do?: boolean;
  }[];
};

// @todo remove this and fix
/* eslint-disable react/prop-types */

export const dosAndDontsSlice: Slice<Data> = {
  id: 'dos-and-donts-slice',
  title: "Dos and Dont's",
  description: 'Show two images with captions of things to do or not do.',
  render: props => <DosAndDonts {...props.data} />,
  schema: {
    type: 'object',
    required: ['items'],
    properties: {
      title: {
        type: 'string',
        title: 'Title',
      },
      description: {
        type: 'string',
        title: 'Description',
      },
      items: {
        type: 'array',
        title: 'Items',
        default: [],
        items: {
          type: 'object',
          required: ['image'],
          properties: {
            image: {
              type: 'string',
              title: 'Image',
            },
            caption: {
              type: 'string',
              title: 'Caption',
            },
            do: {
              type: 'boolean',
              title: 'Do',
            },
          },
        },
      },
    },
  },
  uiSchema: {
    items: {
      'ui:help': 'Please try and keep image file size small',
      items: {
        image: {
          'ui:widget': 'file',
        },
      },
    },
  },
};
