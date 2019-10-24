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
import ColorSwatches from '@knapsack/color-swatch';
import ColorContrastBlock from '@knapsack/color-contrast-block';
import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
import PageWithSidebar from '../../layouts/page-with-sidebar';

function ColorsPage(props) {
  const {
    'border-color': borderColors,
    'text-color': textColors,
    'hr-color': hrColors,
    'background-color': backgroundColors,
    // 'background-gradient': backgroundGradients,
  } = props.tokens;

  return (
    <PageWithSidebar {...props}>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>

      {borderColors && (
        <div>
          <h3>Border Colors</h3>
          {borderColors.map(borderColor => (
            <div
              className="colors-page__demo-box"
              key={borderColor.name}
              style={{
                borderColor: borderColor.value,
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <h4>{borderColor.name}</h4>
              <h5>Value: {borderColor.value}</h5>
              {borderColor.comment && <p>{borderColor.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {backgroundColors && (
        <div>
          <h3>Background Colors</h3>
          <ColorSwatches colors={backgroundColors} />
        </div>
      )}

      {/* eslint-disable */}
      <div>
        {backgroundColors &&
          textColors && (
            <div>
              <h3>Color Contrast</h3>
              <ColorContrastBlock
                bgColors={backgroundColors}
                textColors={textColors}
              />
            </div>
          )}
      </div>
      {/* eslint-disable */}

      {textColors && (
        <div>
          <h3>Text Colors</h3>
          {textColors.map(textColor => (
            <div
              className="colors-page__text-color-demo"
              style={{color: textColor.value}}
              key={textColor.name}
            >
              <h1>{textColor.name} H1</h1>
              <h2>{textColor.name} H2</h2>
              <h3>{textColor.name} H3</h3>
              <h4>{textColor.name} H4</h4>
              <h5>{textColor.name} H5</h5>
              <p>Value: {textColor.value}</p>
              {textColor.comment && <p>{textColor.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {hrColors && (
        <div>
          <h3>Hr Colors</h3>
          {hrColors.map(hrColor => (
            <div className="colors-page__hr-demo" key={hrColor.value}>
              <p>{hrColor.name}</p>
              <hr
                className="colors-page__hr-demo__demo"
                style={{color: hrColor.value}}
              />
              {hrColor.comment && <p>{hrColor.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}

ColorsPage.propTypes = propTypes;

export default makeDesignTokensPage(ColorsPage);
