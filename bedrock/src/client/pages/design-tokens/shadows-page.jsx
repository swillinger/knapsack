import React from 'react';
import { ShadowDemoBox } from './shadows-page.styles';
import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
import PageWithSidebar from '../../layouts/page-with-sidebar';

function ShadowsPage(props) {
  const {
    'box-shadow': boxShadows,
    'inner-shadow': innerShadows,
    'text-shadow': textShadows,
  } = props.tokens;

  return (
    <PageWithSidebar {...props}>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>Shadows</h2>

      <div>
        {boxShadows && (
          <div>
            <h3>Box Shadows</h3>
            {boxShadows.map(boxShadow => (
              <ShadowDemoBox
                key={boxShadow.name}
                style={{
                  boxShadow: boxShadow.value,
                }}
              >
                <h4>{boxShadow.name}</h4>
              </ShadowDemoBox>
            ))}
          </div>
        )}

        {innerShadows && (
          <div>
            <h3>Inner Shadows</h3>
            {innerShadows.map(innerShadow => (
              <ShadowDemoBox
                key={innerShadow.name}
                style={{
                  innerShadow: innerShadow.value,
                }}
              >
                <h4>{innerShadow.name}</h4>
              </ShadowDemoBox>
            ))}
          </div>
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
      </div>
    </PageWithSidebar>
  );
}

ShadowsPage.propTypes = propTypes;

export default makeDesignTokensPage(ShadowsPage);
