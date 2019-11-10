import React from 'react';
import { codeBlockSlice } from './code-slice';

export default {
  title: 'App|CustomSlices/Slices/Code',
  component: codeBlockSlice.render,
  decorators: [],
  parameters: {},
};

export const simple = () =>
  codeBlockSlice.render({
    isEditing: false,
    setSliceData: () => {},
    data: {
      items: [
        {
          code: `const x = 42;`,
          language: 'js',
          name: 'Some JS',
        },
        {
          code: `
body {
  z-index: 42;
}
          `.trim(),
          language: 'css',
          name: 'Some CSS',
        },
      ],
    },
  });
