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
import Spinner from '@basalt/bedrock-spinner';
import {
  DemoTransitionMove,
  DemoTransitionOpacity,
} from './transitions-page.styles';
import makeDesignTokensPage, {
  propTypes,
} from '../../utils/make-design-tokens-page';
import PageWithSidebar from '../../layouts/page-with-sidebar';

function TransitionsPage(props) {
  const { animation: animations } = props.tokens;

  return (
    <PageWithSidebar {...props}>
      <h4 className="eyebrow">Design Tokens</h4>
      <h2>{props.title}</h2>
      <ul>
        {animations && (
          <div>
            {animations.map(animation => (
              <li key={animation.value}>
                <code>
                  ${animation.name}: {animation.value}
                </code>
                {animation.comment && <p>{animation.comment}</p>}
              </li>
            ))}
          </div>
        )}
      </ul>
      <h4>Opacity</h4>
      <p>
        Changes to opacity are an effective way of indicating that an element
        can be interacted with through a click or key press.
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
    </PageWithSidebar>
  );
}

TransitionsPage.propTypes = propTypes;

export default makeDesignTokensPage(TransitionsPage);
