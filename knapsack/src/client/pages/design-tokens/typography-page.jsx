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
import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
import './shadows-page.scss';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import './colors-page.scss';
import './typography-page.scss';

function TypographyPage(props) {
  const {
    'font-size': fontSizes,
    'font-family': fontFamilies,
    'font-weight': fontWeights,
    'font-style': fontStyles,
    'text-color': textColors,
    'text-shadow': textShadows,
    'line-height': lineHeights,
  } = props.tokens;

  return (
    <PageWithSidebar {...props}>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>

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

      {fontFamilies && (
        <>
          <h3>Font families</h3>
          {fontFamilies.map((fontFamily, index) => (
            <div
              className="typography-page__children-demo"
              key={fontFamily.name}
              index={index + 1}
              length={fontFamilies.length}
              style={{
                fontFamily: fontFamily.value,
              }}
            >
              <code>{fontFamily.name}</code>: {fontFamily.value} <br />
              <blockquote contentEditable suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </blockquote>
            </div>
          ))}
        </>
      )}

      {fontWeights && (
        <>
          <h3>Font Weights</h3>
          {fontWeights.map((fontWeight, index) => (
            <div
              className="typography-page__children-demo"
              key={fontWeight.name}
              index={index + 1}
              length={fontWeights.length}
              style={{
                fontWeight: fontWeight.value,
              }}
            >
              <code>{fontWeight.name}</code>: {fontWeight.value} <br />
              <p suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </>
      )}

      {fontStyles && (
        <>
          <h3>Font Styles</h3>
          {fontStyles.map((fontStyle, index) => (
            <div
              className="typography-page__children-demo"
              key={fontStyle.name}
              index={index + 1}
              length={fontStyles.length}
              style={{
                fontStyle: fontStyle.value,
              }}
            >
              <code>{fontStyle.name}</code>: {fontStyle.value} <br />
              <p contentEditable suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </>
      )}
      <br />
      {textColors && (
        <>
          <h3>Text Colors</h3>
          {textColors.map(textColor => (
            <div
              className="colors-page__text-color-demo"
              key={textColor.name}
              style={{ color: textColor.value }}
            >
              <h3>{textColor.name} H3</h3>
              <p>Value: {textColor.value}</p>
              {textColor.comment && <p>{textColor.comment}</p>}
            </div>
          ))}
        </>
      )}

      {textShadows && (
        <div>
          <h3>Text Shadows</h3>
          {textShadows.map(textShadow => (
            <div className="shadow-page__demo-box" key={textShadow.name}>
              <h4>{textShadow.name}</h4>
              <p
                style={{
                  textShadow: textShadow.value,
                }}
              >
                Lorem Ipsum
              </p>
            </div>
          ))}
        </div>
      )}

      {lineHeights && (
        <div>
          <h3>Line Heights</h3>
          {lineHeights.map((lineHeight, index) => (
            <div
              className="typography-page__children-demo"
              key={lineHeight.name}
              index={index + 1}
              length={lineHeights.length}
            >
              <code>{lineHeight.name}</code>: {lineHeight.value} <br />
              <p style={{ lineHeight: lineHeight.value }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
              <br />
            </div>
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}

TypographyPage.propTypes = propTypes;

export default makeDesignTokensPage(TypographyPage);
