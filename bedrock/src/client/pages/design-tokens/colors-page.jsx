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
import ColorSwatches from '@basalt/bedrock-color-swatch';
import ColorContrastBlock from '@basalt/bedrock-color-contrast-block';
import {
  ColorsDemoBox,
  TextColorDemo,
  HrDemoWrapper,
  HrDemo,
} from './colors-page.styles';
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
            <ColorsDemoBox
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
            </ColorsDemoBox>
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
            <TextColorDemo key={textColor.name} color={textColor.value}>
              <h1>{textColor.name} H1</h1>
              <h2>{textColor.name} H2</h2>
              <h3>{textColor.name} H3</h3>
              <h4>{textColor.name} H4</h4>
              <h5>{textColor.name} H5</h5>
              <p>Value: {textColor.value}</p>
              {textColor.comment && <p>{textColor.comment}</p>}
            </TextColorDemo>
          ))}
        </div>
      )}

      {hrColors && (
        <div>
          <h3>Hr Colors</h3>
          {hrColors.map(hrColor => (
            <HrDemoWrapper key={hrColor.value}>
              <p>{hrColor.name}</p>
              <HrDemo color={hrColor.value} />
              {hrColor.comment && <p>{hrColor.comment}</p>}
            </HrDemoWrapper>
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}

ColorsPage.propTypes = propTypes;

export default makeDesignTokensPage(ColorsPage);
