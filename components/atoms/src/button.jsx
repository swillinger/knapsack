import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';

/* eslint-disable react/button-has-type */
export function Button(props) {
  return (
    <button
      className={`k-btn
        ${props.className}
        ${props.primary ? 'k-btn--primary' : ''}`}
      disabled={!!props.disabled}
      onClick={props.onClick}
      onKeyPress={props.onKeyPress}
      style={props.style}
      type={props.type ? props.type : 'button'}
      tabIndex={props.tabIndex}
    >
      {props.children}
    </button>
  );
}

Button.defaultProps = {
  children: null,
  primary: false,
  disabled: false,
  className: '',
  onClick: null,
  onKeyPress: null,
  style: {},
  type: 'button',
  tabIndex: null,
};

/* eslint-disable react/boolean-prop-naming */
Button.propTypes = {
  children: PropTypes.element,
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  style: PropTypes.object,
  type: PropTypes.string,
  tabIndex: PropTypes.number,
};
