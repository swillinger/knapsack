import { configure, addDecorator, addParameters } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
// import {  } from 'storybook-design-token';
import { create } from '@storybook/theming';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { themeDecorator } from './theme-decorator';
//
// const cssReq = require.context(
//   '!!raw-loader!../../../knapsack/src/client/global',
//   true,
//   /.\.css$/,
// );
// const cssTokenFiles = cssReq
//   .keys()
//   .map(filename => ({ filename, content: cssReq(filename).default }));

// coral / ocean highlights
const theme = create({
  base: 'dark',
  colorPrimary: '#FF4785',
  colorSecondary: '#1EA7FD',
});

addDecorator(StoryRouter());
addDecorator(themeDecorator);
addDecorator(withKnobs);
addDecorator(withA11y);
//
// addParameters({
//   designToken: {
//     files: {
//       css: cssTokenFiles,
//     },
//   },
// });
addParameters({ options: { theme } });
addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

// can't use any vars in `require.context` - I know; it's weird!
configure(
  [
    // require.context(
    //   '../../components',
    //   true,
    //   /src.*\.stor(y|ies)\.(jsx|js|ts|tsx|mjs)$/,
    // ),
    require.context(
      '../../knapsack/src/client',
      true,
      /\.stor(y|ies)\.(jsx|js|ts|tsx|mjs)$/,
    ),
    require.context('../src', true, /\.stor(y|ies)\.(jsx|js|ts|tsx|mjs)$/),
  ],
  module,
);
