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
