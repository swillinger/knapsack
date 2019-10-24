import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './clear-filter-button.scss';

export function ClearFilterButton(props) {
  return (
    <div
      className="k-clear-filter-button"
      style={{
        display: props.isVisible ? 'flex' : 'none',
      }}
      onClick={props.onClick}
      onKeyPress={props.onKeyPress}
      role="button"
      tabIndex="0"
    >
      <FaTimes />
    </div>
  );
}

ClearFilterButton.defaultProps = {
  onClick: null,
  onKeyPress: null,
};

ClearFilterButton.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
};
