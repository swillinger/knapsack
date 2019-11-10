import React from 'react';
import { Slice } from './types';

type Data = {
  images: {
    caption?: string;
    src: string;
  }[];
};

export const imageSlice: Slice<Data> = {
  id: 'image-slice',
  title: 'Image Grid',
  description: '1 to 3 images with captions laid out in a grid',
  render: ({ data: { images = [] } = {} }) => {
    if (images.length === 0) return <h5>Not enough data to render...</h5>;
    const width = images.length > 1 ? 99 / images.length : 100;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {images.map(image => (
          <figure
            key={JSON.stringify(image)}
            style={{
              width: `${width}%`,
            }}
          >
            <img src={image.src} alt={image.caption} />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    );
  },
  schema: {
    title: 'Image Slice',
    type: 'object',
    required: [],
    properties: {
      images: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            caption: {
              type: 'string',
            },
            src: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  uiSchema: {
    images: {
      'ui:help': 'Please try and keep image file size small',
      items: {
        src: {
          'ui:widget': 'file',
          // 'ui:widget': 'data-url',
        },
      },
    },
  },
};
