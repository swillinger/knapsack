import React from 'react';
import './text-input-wrapper.scss';

type Props = {
  children: React.ReactNode;
};
export const TextInputWrapper: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="ks-text-input-wrapper ks-text-field__wrapper">
      {children}
    </div>
  );
};
