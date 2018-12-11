/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
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
