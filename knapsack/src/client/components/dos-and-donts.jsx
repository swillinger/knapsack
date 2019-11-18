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
import DosAndDontsPanel from './dos-and-donts-panel';
import './dos-and-donts.scss';

const DosAndDonts = props => (
  <div>
    {props.title && <h4>{props.title}</h4>}
    {props.description && <p>{props.description}</p>}
    <div className="ks-dos-and-donts__wrapper">
      {props.items &&
        props.items.map(item => (
          <DosAndDontsPanel key={item.image} item={item} />
        ))}
    </div>
  </div>
);

DosAndDonts.defaultProps = {
  title: '',
  description: '',
};

DosAndDonts.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      caption: PropTypes.string,
      do: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default DosAndDonts;
