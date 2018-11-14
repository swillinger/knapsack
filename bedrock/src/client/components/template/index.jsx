import React from 'react';
import Twig from './twig';

const Template = props => {
  const TheTemplate = Twig;
  // @todo add React support
  // if (props.template.endsWith('.twig')) {
  //   TheTemplate = Twig;
  // } else {
  //   console.error(
  //     'uh oh!!! Template did not return Twig. Fix that and then get a better error :P @todo',
  //   ); // @todo
  // }
  return <TheTemplate {...props} />;
};

// @todo fix proptypes being lifted up
Template.propTypes = Twig.propTypes;

export default Template;
