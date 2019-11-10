import * as React from 'react';
import { HomeSplash } from './home-splash';

export default {
  title: 'App|HomeSplash',
  component: HomeSplash,
  decorators: [],
  parameters: {},
};

export const simple = () => (
  <HomeSplash
    title="The Title"
    subtitle="The SubTitle"
    version="v1.2.3"
    slogan="The Slogan"
  />
);

export const knapsack = () => (
  <HomeSplash
    title="Knapsack Demo"
    subtitle="The SubTitle"
    version="v1.2.3"
    slogan="Build it in Knapsack"
  />
);
