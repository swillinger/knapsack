import React from 'react';
import PropTypes from 'prop-types';
import './form-array-item.scss';

export function FormArrayItem(props) {
  return <div className="k-form-array-item">{props.children}</div>;
}

FormArrayItem.defaultProps = {
  children: null,
};

FormArrayItem.propTypes = {
  children: PropTypes.element,
};
