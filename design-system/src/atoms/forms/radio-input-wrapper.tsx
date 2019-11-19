import React from 'react';
import PropTypes from 'prop-types';
import './radio-input-wrapper.scss';

export function RadioInputWrapper(props) {
  return <div className="ks-radio-input-wrapper">{props.children}</div>;
}

RadioInputWrapper.defaultProps = {
  children: null,
};

RadioInputWrapper.propTypes = {
  children: PropTypes.element,
};
