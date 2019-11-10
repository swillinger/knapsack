import React from 'react';
import { markdownSlice } from './markdown-slice';

export default {
  title: 'App|CustomSlices/Slices/Markdown',
  component: markdownSlice.render,
  decorators: [],
  parameters: {},
};

export const simple = () =>
  markdownSlice.render({
    isEditing: false,
    setSliceData: () => {},
    data: {
      md: `
# Knapsack (formerly Bedrock)

## Demos

- Demo: <https://demo-bootstrap.knapsack.basalt.io>
- Basalt's Design System, Crux, built on Knapsack: <https://design.basalt.io>

## Requirements

- node.js 8+

## Starting

- Look at our [\`./examples\` folder](https://github.com/basaltinc/knapsack/tree/master/examples) to see how this can be implemented
- [See docs here](https://knapsack.basalt.io)

Spin up a starter setup with these commands:

\`\`\`bash
npm create knapsack my-design-system
cd my-design-system
npm install
npm start
\`\`\`

Open these browser windows:

- http://localhost:3999

## Commands

- \`npm start\` - Compile, start all watches and local server
- \`npm run build\` - Compile with compression turned on
- \`npm run serve\` - Start server
      `,
    },
  });
