import React from 'react';
import PropTypes from 'prop-types';
import './toggle.scss';

export function Toggle(props) {
  return <div className="k-toggle">{props.children}</div>;
}

Toggle.defaultProps = {
  children: null,
};

Toggle.propTypes = {
  children: PropTypes.element,
};
