import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { KnapsackContextConsumer } from '@knapsack/core';

const req = require.context('../stories', true, /\.story\.jsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => (
  <KnapsackContextConsumer>
    <div style={{ fontSize: '18px', maxWidth: 1100 }}>{story()}</div>
  </KnapsackContextConsumer>
));

addDecorator(withKnobs);

configure(loadStories, module);
