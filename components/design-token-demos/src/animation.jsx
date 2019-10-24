import React from 'react';
import { demoPropTypes } from './utils';
// import './animation.scss';

export const AnimationDemo = ({ tokens }) => {
  if (!tokens) return null;
  return (
    <>
      <ul>
        {tokens && (
          <div>
            {tokens.map(token => (
              <li key={token.name}>
                <code>
                  ${token.name}: {token.value}
                </code>
                {token.comment && <p>{token.comment}</p>}
              </li>
            ))}
          </div>
        )}
      </ul>
      {/* @todo figure out how to best demo these */}
      {/* <h4>Opacity</h4> */}
      {/* <p> */}
      {/* Changes to opacity are an effective way of indicating that an element */}
      {/* can be interacted with through a click or key press. */}
      {/* </p> */}
      {/* <div className="dtd-animation__transition-opacity-demo"> */}
      {/* <strong>Opacity</strong> (Hover to see effect) */}
      {/* </div> */}
      {/* <br /> */}
      {/* <h4>Movement</h4> */}
      {/* <p> */}
      {/* Movement is an effective way to communicate actions, changes to */}
      {/* application state, and draw the attention of a user. */}
      {/* </p> */}
      {/* <div className="dtd-animation__transition-move-demo"> */}
      {/* <strong>Move</strong> (Hover to see effect) */}
      {/* </div> */}
    </>
  );
};

AnimationDemo.propTypes = demoPropTypes;
