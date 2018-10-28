import React from 'react';
import Twig from './twig';

// @todo rename package from `@basalt/bedrock-twig` to `@basalt/bedrock-template`

const Template = props => {
  let TheTemplate;
  // @todo add React support
  if (props.template.endsWith('.twig')) {
    TheTemplate = Twig;
  } else {
    console.error(
      'uh oh!!! Template did not return Twig. Fix that and then get a better error :P @todo',
    ); // @todo
  }
  return <TheTemplate {...props} />;
};

export default Template;
