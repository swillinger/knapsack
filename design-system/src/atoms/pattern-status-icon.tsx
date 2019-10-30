import React from 'react';
import PropTypes from 'prop-types';
import './pattern-status-icon.scss';

export function PatternStatusIcon(props) {
  return (
    <span
      className="k-pattern-status-icon"
      title={props.title}
      style={{
        backgroundColor: props.color ? props.color : '#ccc',
      }}
    />
  );
}

PatternStatusIcon.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
