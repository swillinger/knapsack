import React from 'react';
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
    demoDatas={[{}, {}, {}]}
    demoDataIndex={0}
    isTitleShown
    handleOpenNewTabClick={action('handleOpenNewTabClick')}
    handleAssetSetChange={action('handleAssetSetChange')}
    handleDemoPrevClick={action('handleDemoPrevClick')}
    handleDemoNextClick={action('handleDemoNextClick')}
  />
);

export const justData = () => (
  <TemplateHeader
    title="A Template Title"
    demoDatas={[{}, {}, {}]}
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
