import React from 'react';
import './form-array-item.scss';

type Props = {
  children: React.ReactNode;
};

export const FormArrayItem: React.FC<Props> = (props: Props) => {
  return <div className="ks-form-array-item">{props.children}</div>;
};
