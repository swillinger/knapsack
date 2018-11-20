import React from 'react';
import {
  TypographyChildrenDemoWrapper,
  FontSizeDemo,
} from './typography-page.styles';
import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
import { TextColorDemo } from './colors-page.styles';
import { ShadowDemoBox } from './shadows-page.styles';
import PageWithSidebar from '../../layouts/page-with-sidebar';

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

      {fontFamilies && (
        <>
          <h3>Font families</h3>
          {fontFamilies.map((fontFamily, index) => (
            <TypographyChildrenDemoWrapper
              key={fontFamily.name}
              index={index + 1}
              length={fontFamilies.length}
              fontFamily={fontFamily.value}
            >
              <code>{fontFamily.name}</code>: {fontFamily.value} <br />
              <blockquote contentEditable suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </blockquote>
            </TypographyChildrenDemoWrapper>
          ))}
        </>
      )}

      {fontWeights && (
        <>
          <h3>Font Weights</h3>
          {fontWeights.map((fontWeight, index) => (
            <TypographyChildrenDemoWrapper
              key={fontWeight.name}
              index={index + 1}
              length={fontWeights.length}
              fontWeight={fontWeight.value}
            >
              <code>{fontWeight.name}</code>: {fontWeight.value} <br />
              <p suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </TypographyChildrenDemoWrapper>
          ))}
        </>
      )}

      {fontStyles && (
        <>
          <h3>Font Styles</h3>
          {fontStyles.map((fontStyle, index) => (
            <TypographyChildrenDemoWrapper
              key={fontStyle.name}
              index={index + 1}
              length={fontStyles.length}
              fontStyle={fontStyle.value}
            >
              <code>{fontStyle.name}</code>: {fontStyle.value} <br />
              <p contentEditable suppressContentEditableWarning>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </TypographyChildrenDemoWrapper>
          ))}
        </>
      )}
      <br />
      {textColors && (
        <>
          <h3>Text Colors</h3>
          {textColors.map(textColor => (
            <TextColorDemo key={textColor.name} color={textColor.value}>
              <h3>{textColor.name} H3</h3>
              <p>Value: {textColor.value}</p>
              {textColor.comment && <p>{textColor.comment}</p>}
            </TextColorDemo>
          ))}
        </>
      )}

      {textShadows && (
        <div>
          <h3>Text Shadows</h3>
          {textShadows.map(textShadow => (
            <ShadowDemoBox key={textShadow.name}>
              <h4>{textShadow.name}</h4>
              <p
                style={{
                  textShadow: textShadow.value,
                }}
              >
                Lorem Ipsum
              </p>
            </ShadowDemoBox>
          ))}
        </div>
      )}

      {lineHeights && (
        <div>
          <h3>Line Heights</h3>
          {lineHeights.map((lineHeight, index) => (
            <TypographyChildrenDemoWrapper
              key={lineHeight.name}
              index={index + 1}
              length={lineHeights.length}
              lineHeight={lineHeight.value}
            >
              <code>{lineHeight.name}</code>: {lineHeight.value} <br />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
              <br />
            </TypographyChildrenDemoWrapper>
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}

TypographyPage.propTypes = propTypes;

export default makeDesignTokensPage(TypographyPage);
