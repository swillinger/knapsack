import React from 'react';
import PropTypes from 'prop-types';
import './form-icon-button.scss';

export function FormIconButton(props) {
  return (
    <div
      className={`k-form-icon-button
        ${props.active ? 'k-form-icon-button--active' : ''}`}
      onKeyPress={props.onKeyPress}
      onClick={props.onClick}
      ariaLabel={props.ariaLabel}
      tabIndex={props.tabIndex}
      role="button"
    >
      {props.backgroundImage && (
        <div
          className="k-form-icon-button__icon"
          style={{
            background: props.backgroundImage,
          }}
        />
      )}
    </div>
  );
}

FormIconButton.defaultProps = {
  active: false,
  backgroundImage: null,
  onKeyPress: null,
  onClick: null,
  tabIndex: 0,
};

/* eslint-disable react/boolean-prop-naming */
FormIconButton.propTypes = {
  active: PropTypes.bool,
  backgroundImage: PropTypes.string,
  onKeyPress: PropTypes.func,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
};
