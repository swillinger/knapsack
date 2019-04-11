import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import {
  KnapsackContextProvider,
  KnapsackContextConsumer,
} from '@knapsack/core';
import { ThemeProvider } from 'styled-components';

const req = require.context('../stories', true, /\.story\.jsx$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

addDecorator(story => (
  <KnapsackContextConsumer>
    {({ theme }) => (
      <ThemeProvider theme={theme}>
        <div style={{ fontSize: theme.globals.fontSize, maxWidth: 1100,}}>
          {story()}
        </div>
      </ThemeProvider>
    )}
  </KnapsackContextConsumer>
));

addDecorator(withKnobs);

configure(loadStories, module);
