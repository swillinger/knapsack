import React from 'react';
import PropTypes from 'prop-types';
import './text-input-wrapper.scss';

export function TextInputWrapper(props) {
  return <div className="k-text-input-wrapper">{props.children}</div>;
}

TextInputWrapper.defaultProps = {
  children: null,
};

TextInputWrapper.propTypes = {
  children: PropTypes.element,
};
