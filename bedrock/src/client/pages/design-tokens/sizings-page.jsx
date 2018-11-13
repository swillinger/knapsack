import React from 'react';
import SpacingSwatches from '@basalt/bedrock-spacing-swatch';

import makeDesignTokensPage from '../../utils/make-design-tokens-page';
import {FontSizeDemo} from "./typography-page.styles";

function SizingsPage(props) {
  const {
    'spacing': spacings,
    'font-size': fontSizes,
    'media-query': mediaQueries,
  } = props.tokens;

  return (
    <div>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>

        {spacings && (
          <div>
            <h3>Spacing</h3>
            <SpacingSwatches spaces={spacings}/>
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

    </div>
  );
}

// SizingsPage.propTypes = {
//   context: contextPropTypes.isRequired,
// };

export default makeDesignTokensPage(SizingsPage);
