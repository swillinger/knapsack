import * as React from 'react';
import cn from 'classnames';

type Props = {
  type?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: false;
  outlined?: false;
  children: React.ReactNode;
};

const Button: React.FC<Props> = ({
  type = 'primary',
  size = 'md',
  disabled = false,
  outlined = false,
  children,
}: Props) => {
  const classes = cn(
    'bootstrap',
    'btn',
    `btn-${size}`,
    disabled && `disabled`,
    outlined ? `btn-outline-${type}` : `btn-${type}`,
    {}
    );
  return <button className={classes}>{children}</button>;
};

export default Button;
