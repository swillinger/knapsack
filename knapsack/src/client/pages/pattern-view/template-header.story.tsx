import React from 'react';
import PropMatrix from 'react-prop-matrix';
import { action } from '@storybook/addon-actions';
import { TemplateHeader } from './template-header';

export default {
  title: 'Components|TemplateHeader',
  component: TemplateHeader,
  decorators: [],
  parameters: {},
};

const assetSets = [
  {
    id: 'bootstrap',
    title: 'Bootstrap',
    // inlineJs: `document.body.setAttribute('data-theme', 'bootstrap');`,
    assets: [{ src: './public/css/bootstrap.css' }],
  },
  {
    id: 'material',
    title: 'Material',
    assets: [
      { src: './public/css/material.css' },
      { src: './public/css/material-theming.css' },
    ],
  },
];

export const full = () => (
  <TemplateHeader
    title="A Template Title"
    assetSets={assetSets}
    assetSetId={assetSets[1].id}
    demoDataIndex={0}
    demoDatasLength={3}
    isTitleShown
    handleOpenNewTabClick={action('handleOpenNewTabClick')}
    handleAssetSetChange={action('handleAssetSetChange')}
    handleDemoPrevClick={action('handleDemoPrevClick')}
    handleDemoNextClick={action('handleDemoNextClick')}
  />
);

const options = {
  isTitleShown: [true, false],
  title: [
    'My Template',
    'Really long title lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ],
  assetSets: [assetSets, []],
  demoDatasLength: [0, 3],
};

export const allVariations = () => (
  <PropMatrix options={options}>
    {props => (
      <>
        <TemplateHeader
          {...props}
          handleOpenNewTabClick={action('handleOpenNewTabClick')}
          handleAssetSetChange={action('handleAssetSetChange')}
          handleDemoPrevClick={action('handleDemoPrevClick')}
          handleDemoNextClick={action('handleDemoNextClick')}
        />
        <hr />
      </>
    )}
  </PropMatrix>
);

export const justData = () => (
  <TemplateHeader
    title="A Template Title"
    demoDatasLength={3}
    demoDataIndex={0}
    isTitleShown
    handleOpenNewTabClick={action('handleOpenNewTabClick')}
    handleAssetSetChange={action('handleAssetSetChange')}
    handleDemoPrevClick={action('handleDemoPrevClick')}
    handleDemoNextClick={action('handleDemoNextClick')}
  />
);

export const justAssetSets = () => (
  <TemplateHeader
    title="A Template Title"
    assetSets={assetSets}
    assetSetId={assetSets[0].id}
    isTitleShown
    handleOpenNewTabClick={action('handleOpenNewTabClick')}
    handleAssetSetChange={action('handleAssetSetChange')}
    handleDemoPrevClick={action('handleDemoPrevClick')}
    handleDemoNextClick={action('handleDemoNextClick')}
  />
);

export const simple = () => (
  <TemplateHeader
    title="A Template Title"
    handleOpenNewTabClick={action('handleOpenNewTabClick')}
    handleAssetSetChange={action('handleAssetSetChange')}
    handleDemoPrevClick={action('handleDemoPrevClick')}
    handleDemoNextClick={action('handleDemoNextClick')}
    isTitleShown
  />
);
