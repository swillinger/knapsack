import React from 'react';
import cn from 'classnames';
import './button.scss';
import { Icon, Icons } from './icon';

export enum SIZES {
  s = 's',
  m = 'm',
}

export enum KINDS {
  'standard' = 'standard',
  'icon-standard' = 'icon-standard',
  'primary' = 'primary',
  'cancel' = 'cancel',
  'icon' = 'icon',
}

export enum EMPHASSIS {
  'none' = 'none',
  'danger' = 'danger',
}

type Btn = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type Props = {
  children?: React.ReactNode;
  disabled?: boolean;
  /**
   * @deprecated use `handleTrigger`
   */
  onClick?: Btn['onClick'];
  /**
   * @deprecated use `handleTrigger`
   */
  onKeyPress?: Btn['onKeyPress'];
  /**
   * Passed to `onClick` & `onKeyPress`
   */
  handleTrigger?: () => void;
  // onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  // type?: 'button' | 'submit' | 'reset';
  type?: Btn['type'];
  kind?: keyof typeof KINDS;
  floating?: boolean;
  size?: keyof typeof SIZES;
  flush?: boolean;
  emphasis?: keyof typeof EMPHASSIS;
  icon?: keyof typeof Icons;
  tabIndex?: number;
};

export const KsButton: React.FC<Props> = ({
  children,
  disabled = false,
  onClick,
  onKeyPress,
  handleTrigger,
  type = 'button',
  kind = KINDS.standard,
  floating = false,
  size = SIZES.m,
  flush = false,
  emphasis = EMPHASSIS.none,
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
  });

  const isIconBtn = kind === KINDS.icon || kind === KINDS['icon-standard'];

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={classes}
      disabled={disabled}
      onClick={handleTrigger || onClick}
      onKeyPress={handleTrigger || onKeyPress}
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
