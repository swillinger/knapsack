import React from 'react';
import './type-to-filter-input-wrapper.scss';

export const TypeToFilterInputWrapper: React.FC = props => {
  return (
    <div className="ks-type-to-filter-input-wrapper">{props.children}</div>
  );
};
