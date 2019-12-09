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
  children: React.ReactNode;
};

const Button: React.FC<Props> = ({
  type = 'primary',
  size = 'md',
  children,
}: Props) => {
  const classes = cn('bootstrap', 'btn', `btn-${type}`, `btn-${size}`, {});
  return <button className={classes}>{children}</button>;
};

export default Button;
