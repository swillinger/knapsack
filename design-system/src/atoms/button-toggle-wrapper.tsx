import React from 'react';
import './button-toggle-wrapper.scss';

// Children should consist of standard buttons, optionally wrapped by
// a KsPopup (tooltip). Each button should have an active state, only
// one button may be active at once.

type Props = {
  children?: React.ReactNode;
};

export const KsButtonToggleWrapper: React.FC<Props> = ({ children }: Props) => {
  return <span className="ks-button-toggle-wrapper">{children}</span>;
};
