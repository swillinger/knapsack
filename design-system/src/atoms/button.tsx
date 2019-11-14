import React from 'react';
import cn from 'classnames';
import './button.scss';

export const sizes = ['s', 'm', 'l'];
export const kinds = ['primary', 'secondary'];

type Btn = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type Props = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: Btn['onClick'];
  onKeyPress?: Btn['onKeyPress'];
  // onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  // type?: 'button' | 'submit' | 'reset';
  type?: Btn['type'];
  kind?: 'primary' | 'secondary';
  size?: 's' | 'm' | 'l';
  tabIndex?: number;
};

export const Button: React.FC<Props> = ({
  type = 'button',
  disabled = false,
  onClick,
  onKeyPress,
  tabIndex,
  kind = 'secondary',
  size = 'm',
  children,
}: Props) => {
  const classes = cn({
    'k-btn': true,
    [`k-btn--kind-${kind}`]: true,
    [`k-btn--size-${size}`]: true,
  });
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      onKeyPress={onKeyPress}
      type={type}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
};
