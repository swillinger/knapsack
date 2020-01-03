import * as React from 'react';
import cn from 'classnames';
import {ButtonProps} from '../../../dist/meta/button/button-react.spec';

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  size = 'md',
  disabled = false,
  outlined = false,
  children,
  handleClick,
  icon,
}: ButtonProps) => {
  const classes = cn(
    'bootstrap',
    'btn',
    `btn-${size}`,
    disabled && `disabled`,
    outlined ? `btn-outline-${type}` : `btn-${type}`,
    {}
    );
  return <button className={classes} onClick={event => handleClick()}>{icon}{children}</button>;
};

export default Button;
