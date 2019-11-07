import React from 'react';
import './form-icon-tray.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const FormIconTray: React.FC<Props> = ({
  children,
  className = '',
  style = {},
}: Props) => {
  return (
    <div className={`k-form-icon-tray ${className}`} style={style}>
      {children}
    </div>
  );
};
