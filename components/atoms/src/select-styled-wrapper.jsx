import React from 'react';
import PropTypes from 'prop-types';
import './select-styled-wrapper.scss';

export function SelectStyledWrapper(props) {
  return (
    /* eslint-disable */
    <label className="k-select-styled-wrapper" tabIndex={props.tabIndex}>
      {props.children}
    </label>
    /* eslint-enable */
  );
}

SelectStyledWrapper.defaultProps = {
  tabIndex: null,
};

SelectStyledWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  tabIndex: PropTypes.string,
};
