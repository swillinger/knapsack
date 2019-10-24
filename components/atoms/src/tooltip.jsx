import React from 'react';
import PropTypes from 'prop-types';
import './tooltip.scss';

export function Tooltip(props) {
  return (
    <div
      className="k-tooltip"
      bg_color={props.bg_color}
      text_color={props.text_color}
      data-position={props.position}
    >
      {props.children}
      <span
        style={{
          background: props.bg_color,
          color: props.text_color,
        }}
      >
        {props.tooltipContent}
      </span>
    </div>
  );
}

Tooltip.defaultProps = {
  bg_color: 'white',
  text_color: '#484848',
  position: 'top',
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tooltipContent: PropTypes.string.isRequired,
  bg_color: PropTypes.string,
  text_color: PropTypes.string,
  position: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
};
