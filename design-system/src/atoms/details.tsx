import React from 'react';
import './details.scss';

type Props = {
  open?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Details: React.FC<Props> = ({
  children,
  className,
  open = false,
}: Props) => {
  return (
    <details className={`ks-details ${className}`} open={open}>
      {children}
    </details>
  );
};
