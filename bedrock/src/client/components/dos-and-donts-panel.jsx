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
import PropTypes from 'prop-types';
import { DosAndDontsPanelStyled } from './dos-and-donts.styles';

export default function DosAndDontsPanel(props) {
  return (
    <DosAndDontsPanelStyled do={props.item.do}>
      <div>
        <img alt="" src={props.item.image} />
        <figcaption>
          <strong>{props.item.do ? 'Do: ' : "Don't: "}</strong>
          {props.item.caption}
        </figcaption>
      </div>
    </DosAndDontsPanelStyled>
  );
}

DosAndDontsPanel.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    caption: PropTypes.string,
    do: PropTypes.bool,
  }).isRequired,
};
