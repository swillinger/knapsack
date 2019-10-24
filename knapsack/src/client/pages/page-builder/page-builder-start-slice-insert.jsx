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
import './page-builder-start-slice-insert.scss';

function PageBuilderStartSliceInsert(props) {
  const { isActive, hasVisibleControls } = props;
  return (
    <div
      onClick={props.onClick}
      onKeyPress={props.onKeyPress}
      role="button"
      aria-label={
        isActive ? 'Slice Position Selected' : 'Select Slice Position'
      }
      tabIndex="0"
      className={`page-builder-start-slice-insert ${
        isActive ? 'page-builder-start-slice-insert--active' : ''
      }`}
      style={{
        display: hasVisibleControls ? 'block' : 'none',
      }}
    >
      {isActive ? (
        <h6>Select a component to add from the sidebar</h6>
      ) : (
        <h6>Click to Insert Content Here</h6>
      )}
    </div>
  );
}

PageBuilderStartSliceInsert.propTypes = {
  onClick: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  hasVisibleControls: PropTypes.bool.isRequired,
};

export default PageBuilderStartSliceInsert;
