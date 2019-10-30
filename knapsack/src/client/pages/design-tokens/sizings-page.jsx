/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import { SpacingDemo } from '@knapsack/design-system';

import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
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
          <SpacingDemo spaces={spacings} />
        </div>
      )}

      {fontSizes && (
        <div>
          <h3>Font sizes</h3>
          {fontSizes.map((fontSize, index) => (
            <div
              className="typography-page__font-size-demo"
              key={fontSize.name}
              index={index + 1}
              length={fontSizes.length}
              style={{
                fontSize: fontSize.value,
                borderBottom:
                  fontSizes.length !== index + 1
                    ? '1px dotted var(--c-gray-xlight)'
                    : '',
                paddingBottom:
                  fontSizes.length !== index + 1 ? 'var(--size-m)' : '',
                marginBottom:
                  fontSizes.length !== index + 1 ? 'var(--size-l)' : '',
              }}
            >
              <code>{fontSize.name}</code>: {fontSize.value} <br />
              <blockquote contentEditable suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </blockquote>
            </div>
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}

SizingsPage.propTypes = propTypes;

export default makeDesignTokensPage(SizingsPage);
