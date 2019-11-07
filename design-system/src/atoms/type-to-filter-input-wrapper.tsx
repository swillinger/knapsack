import React from 'react';
import PropTypes from 'prop-types';
import './type-to-filter-input-wrapper.scss';

export function TypeToFilterInputWrapper(props) {
  return <div className="k-type-to-filter-input-wrapper">{props.children}</div>;
}

TypeToFilterInputWrapper.defaultProps = {
  children: null,
};

TypeToFilterInputWrapper.propTypes = {
  children: PropTypes.element,
};
