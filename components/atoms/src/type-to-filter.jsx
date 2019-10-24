import React from 'react';
import PropTypes from 'prop-types';
import './type-to-filter.scss';

export function TypeToFilter(props) {
  return <div className="k-type-to-filter">{props.children}</div>;
}

TypeToFilter.defaultProps = {
  children: null,
};

TypeToFilter.propTypes = {
  children: PropTypes.element,
};
