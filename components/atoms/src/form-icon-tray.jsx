import React from 'react';
import PropTypes from 'prop-types';
import './form-icon-tray.scss';

export function FormIconTray(props) {
  return (
    <div className={`k-form-icon-tray ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
}

FormIconTray.defaultProps = {
  className: null,
  style: null,
};

FormIconTray.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  style: PropTypes.string,
};
