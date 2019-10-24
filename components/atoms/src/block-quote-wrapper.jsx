import React from 'react';
import PropTypes from 'prop-types';
import './block-quote-wrapper.scss';

export function BlockQuoteWrapper(props) {
  return <blockquote className="k-block-quote">{props.children}</blockquote>;
}

BlockQuoteWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};
