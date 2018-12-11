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
import SpacingSwatches from '@basalt/bedrock-spacing-swatch';

import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
import { FontSizeDemo } from './typography-page.styles';
import PageWithSidebar from '../../layouts/page-with-sidebar';

function SizingsPage(props) {
  const {
    spacing: spacings,
    'font-size': fontSizes,
    // 'media-query': mediaQueries,
  } = props.tokens;

  return (
    <PageWithSidebar {...props}>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>

      {spacings && (
        <div>
          <h3>Spacing</h3>
          <SpacingSwatches spaces={spacings} />
        </div>
      )}

      {fontSizes && (
        <div>
          <h3>Font sizes</h3>
          {fontSizes.map((fontSize, index) => (
            <FontSizeDemo
              key={fontSize.name}
              index={index + 1}
              length={fontSizes.length}
              fontSize={fontSize.value}
            >
              <code>{fontSize.name}</code>: {fontSize.value} <br />
              <blockquote contentEditable suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </blockquote>
            </FontSizeDemo>
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}

SizingsPage.propTypes = propTypes;

export default makeDesignTokensPage(SizingsPage);
