import React from 'react';
import { BordersDemoBox } from './borders-page.styles';
import makeDesignTokensPage from '../../utils/make-design-tokens-page';

function BordersPage(props) {
  const {
    'border-color': borderColors,
    'border-radius': borderRadii,
    'border-style': borderStyles,
  } = props.tokens;

  return (
    <div>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>

      <div>
        {borderColors && (
          <div>
            <h3>Border Color</h3>
            {borderColors.map(borderColor => (
              <BordersDemoBox
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
              </BordersDemoBox>
            ))}
          </div>
        )}
      </div>

      <div>
        {borderRadii && (
          <div>
            <h3>Border Radius</h3>
            {borderRadii.map(borderRadius => (
              <BordersDemoBox
                key={borderRadius.name}
                style={{
                  borderRadius: borderRadius.value,
                  border: '1px solid black',
                }}
              >
                <h4>{borderRadius.name}</h4>
                <h5>Value: {borderRadius.value}</h5>
                {borderRadius.comment && <p>{borderRadius.comment}</p>}
              </BordersDemoBox>
            ))}
          </div>
        )}
      </div>

      <div>
        {borderStyles && (
          <div>
            <h3>Border Style</h3>
            {borderStyles.map(borderStyle => (
              <BordersDemoBox
                key={borderStyle.name}
                style={{
                  // borderStyle: borderStyle.value,
                  border: `1px ${borderStyle.value} black`,
                }}
              >
                <h4>{borderStyle.name}</h4>
                <h5>Value: {borderStyle.value}</h5>
                {borderStyle.comment && <p>{borderStyle.comment}</p>}
              </BordersDemoBox>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

// BordersPage.propTypes = {
//   context: contextPropTypes.isRequired,
// };

export default makeDesignTokensPage(BordersPage);
