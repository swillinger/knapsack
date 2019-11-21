import React from 'react';
import cn from 'classnames';
import './button.scss';
import { Icon, Props as IconProps } from './icon';

export const sizes = ['s', 'm'];
export const kinds = ['standard', 'icon-standard', 'primary', 'cancel', 'icon'];
export const emphasiss = ['none', 'danger'];

type Btn = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type Props = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: Btn['onClick'];
  onKeyPress?: Btn['onKeyPress'];
  className?: string;
  // onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  // type?: 'button' | 'submit' | 'reset';
  type?: Btn['type'];
  kind?: 'standard' | 'icon-standard' | 'primary' | 'cancel' | 'icon';
  floating?: boolean;
  size?: 's' | 'm';
  flush?: boolean;
  emphasis?: 'none' | 'danger';
  icon?: IconProps['symbol'];
  tabIndex?: number;
};

export const Button: React.FC<Props> = ({
  children,
  disabled = false,
  onClick,
  onKeyPress,
  className,
  type = 'button',
  kind = 'standard',
  floating = false,
  size = 'm',
  flush = false,
  emphasis = 'none',
  icon,
  tabIndex,
}: Props) => {
  const classes = cn({
    'ks-btn': true,
    [`ks-btn--kind-${kind}`]: true,
    [`ks-btn--size-${size}`]: true,
    [`ks-btn--emphasis-${emphasis}`]: true,
    'ks-btn--floating': floating,
    'ks-btn--flush': flush,
    [`${className}`]: true,
  });

  const isIconBtn = kind === 'icon' || kind === 'icon-standard';

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
      {icon && <Icon symbol={icon} size={size} />}
      {isIconBtn ? (
        <span className="ks-u-screen-reader-only">{children}</span>
      ) : (
        children
      )}
    </button>
  );
};
