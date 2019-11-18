import React from 'react';
import PropTypes from 'prop-types';
import './checkbox-input-wrapper.scss';

export function CheckboxInputWrapper(props) {
  return <div className="ks-checkbox-input-wrapper">{props.children}</div>;
}

CheckboxInputWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};
