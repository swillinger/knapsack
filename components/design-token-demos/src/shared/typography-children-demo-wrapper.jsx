import React from 'react';
import PropTypes from 'prop-types';
import './typography-children-demo-wrapper.scss';

export default function TypographyChildrenDemoWrapper(props) {
  return (
    <div
      className="dtd-typography-children-demo-wrapper"
      style={{
        fontFamily: props.fontFamily,
        fontWeight: props.fontWeight ? props.fontWeight : 400,
        fontStyle: props.fontStyle ? props.fontStyle : 'normal',
      }}
    >
      {props.children}
    </div>
  );
}

TypographyChildrenDemoWrapper.defaultProps = {
  children: null,
  fontFamily: null,
  fontWeight: null,
  fontStyle: null,
};

TypographyChildrenDemoWrapper.propTypes = {
  children: PropTypes.element,
  fontFamily: PropTypes.string,
  fontWeight: PropTypes.number,
  fontStyle: PropTypes.string,
};
