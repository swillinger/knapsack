import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { create } from '@storybook/theming';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { themeDecorator } from './theme-decorator';

// coral / ocean highlights
const theme = create({
  base: 'dark',
  colorPrimary: '#FF4785',
  colorSecondary: '#1EA7FD',
});

addDecorator(themeDecorator);
addDecorator(withKnobs);

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
    require.context(
      '../../../components',
      true,
      /src.*\.stor(y|ies)\.(jsx|js|ts|tsx|mjs)$/,
    ),
    require.context(
      '../../../knapsack/src/client',
      true,
      /\.stor(y|ies)\.(jsx|js|ts|tsx|mjs)$/,
    ),
  ],
  module,
);
