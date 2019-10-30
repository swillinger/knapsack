import React from 'react';
import PropTypes from 'prop-types';
import './demo-block.scss';

export function DemoBlock(props) {
  return <div className="k-demo-block">{props.children}</div>;
}

DemoBlock.defaultProps = {
  children: null,
};

DemoBlock.propTypes = {
  children: PropTypes.element,
};
