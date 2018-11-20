import React from 'react';
import PropTypes from 'prop-types';

export * from './animation';
export * from './background-color';
export * from './background-gradient';
export * from './border-color';
export * from './border-radius';
export * from './border-style';
export * from './box-shadow';
export * from './font-family';
export * from './font-size';
export * from './font-style';
export * from './font-weight';
export * from './hr-color';
export * from './inner-shadow';
export * from './line-height';
export * from './media-query';
export * from './spacing';
export * from './text-color';
export * from './text-shadow';

export const TokenCategory = ({ tokenCategory, children }) => (
  <aside id={tokenCategory.id} style={{ borderBottom: 'solid 1px #ccc' }}>
    <h3>{tokenCategory.name}</h3>
    <div>{children}</div>
  </aside>
);

TokenCategory.propTypes = {
  tokenCategory: {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }.isRequired,
  children: PropTypes.element.isRequired,
};
