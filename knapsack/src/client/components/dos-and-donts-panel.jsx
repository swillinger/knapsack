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
import PropTypes from 'prop-types';
import './dos-and-donts-panel.scss';

export default function DosAndDontsPanel(props) {
  return (
    <figure
      className="dos-and-donts-panel"
      style={{
        borderBottomColor: props.item.do
          ? 'var(--c-green-ghost)'
          : 'var(--c-red-ghost)',
      }}
    >
      <div>
        <img alt="" src={props.item.image} />
        <figcaption>
          <strong
            style={{
              color: props.item.do
                ? 'var(--c-green-ghost)'
                : 'var(--c-red-ghost)',
            }}
          >
            {props.item.do ? 'Do: ' : "Don't: "}
          </strong>
          {props.item.caption}
        </figcaption>
      </div>
    </figure>
  );
}

DosAndDontsPanel.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    caption: PropTypes.string,
    do: PropTypes.bool,
  }).isRequired,
};
