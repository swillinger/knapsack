import React from 'react';
import Spinner from '@basalt/bedrock-spinner';
import {
  DemoTransitionMove,
  DemoTransitionOpacity,
} from './transitions-page.styles';
import makeDesignTokensPage from "../../utils/make-design-tokens-page";

function TransitionsPage(props) {
  const {
    'animation': animations,
  } = props.tokens;


  return (
    <div>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>
      <ul>
        {animations && (
          <div>
            {animations.map(animation => (
              <li>
                <code>${animation.name}: {animation.value}</code>
                {animation.comment && <p>{animation.comment}</p>}
              </li>
            ))}
          </div>
        )}
      </ul>
      <h4>Opacity</h4>
      <p>
        Changes to opacity are an effective way of indicating that an
        element can be interacted with through a click or key press.
      </p>
      <DemoTransitionOpacity>
        <strong>Opacity</strong> (Hover to see effect)
      </DemoTransitionOpacity>
      <br />
      <h4>Movement</h4>
      <p>
        Movement is an effective way to communicate actions, changes to
        application state, and draw the attention of a user.
      </p>
      <DemoTransitionMove>
        <strong>Move</strong> (Hover to see effect)
      </DemoTransitionMove>
      <div>
        <h5>Loading Spinner Example</h5>
        <Spinner />
      </div>
      <br />
      </div>
    );
  }

{/*AnimationsPage.propTypes = {*/}
  {/*context: contextPropTypes.isRequired,*/}
{/*};*/}

export default makeDesignTokensPage(TransitionsPage);
