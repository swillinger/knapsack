import React from 'react';
import PropTypes from 'prop-types';
import './text-input-wrapper.scss';

export function TextInputWrapper(props) {
  return <div className="ks-text-input-wrapper">{props.children}</div>;
}

TextInputWrapper.defaultProps = {
  children: null,
};

TextInputWrapper.propTypes = {
  children: PropTypes.element,
};
