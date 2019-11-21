import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './text-input-wrapper.scss';

export function TextInputWrapper(props) {
  return (
    <div className={cn('ks-text-input-wrapper', props.className)}>
      {props.children}
    </div>
  );
}

TextInputWrapper.defaultProps = {
  children: null,
  className: null,
};

TextInputWrapper.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};
