import React from 'react';
import { plugins } from '@basalt/bedrock-core';
import * as Demos from '@basalt/bedrock-design-token-demos';

plugins.register('design-tokens', api => {// eslint-disable-line
  Object.keys(Demos).forEach(DemoName => {
    const Demo = Demos[DemoName];
    if (Demo.tokenCategory) {
      plugins.addDesignTokenCategoryDemo({
        id: Demo.tokenCategory,
        render: props => <Demo {...props} />,
      });
    }
  });
});
