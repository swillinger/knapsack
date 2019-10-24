import React from 'react';
import PropTypes from 'prop-types';
import './details.scss';

export function Details(props) {
  return (
    <details className={`k-details ${props.className}`} open={props.open}>
      {props.children}
    </details>
  );
}

Details.defaultProps = {
  children: null,
  className: null,
  open: false,
};

/* eslint-disable react/boolean-prop-naming */
Details.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  open: PropTypes.bool,
};
