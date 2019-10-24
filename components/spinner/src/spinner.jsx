import React from 'react';
import PropTypes from 'prop-types';
import './spinner.scss';

const Spinner = props => {
  if (props.error) {
    // used by `react-loadable`
    throw new Error(props.error);
  }
  return (
    <div>
      <br />
      <div className="spinner__core">
        <div className="spinner__cube-one" />
        {/* @todo the added styles below are for a bug introduced in v4 of sytled components */}
        <div
          className="spinner__cube-two"
          style={{ animationDelay: '-0.9s' }}
        />
      </div>
      <br />
      {props.text && <h2>{props.text}</h2>}
    </div>
  );
};

Spinner.propTypes = {
  text: PropTypes.string,
  error: PropTypes.string,
};

Spinner.defaultProps = {
  text: '',
  error: null,
};

export default Spinner;
