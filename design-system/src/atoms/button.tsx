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
  /**
   * Which style to use (primary, icon, etc)
   * @example <KsButton kind="icon" icon="add" />
   */
  kind?: keyof typeof KINDS;
  /**
   * Used with kind="icon". Floating/absolutely positioned icon button.
   */
  floating?: boolean;
  size?: keyof typeof SIZES;
  /** Make the button a block level, full width element. Works with certain button kinds. */
  isFullWidth?: boolean;
  /** Strips any default margin/padding, primarily works with certain kinds. */
  flush?: boolean;
  /** Set an emphasis (currently only "danger" available). Emphasis works with certain kinds. */
  emphasis?: keyof typeof EMPHASSIS;
  /** Use an icon with this button. Button kinds may handle this slightly differently. */
  icon?: keyof typeof Icons;
  tabIndex?: number;
  className?: string;
  /** Apply active state, used for certain kinds, primarily Standard buttons inside KsButtonSelectWrapper */
  active?: boolean;
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
  isFullWidth = false,
  flush = false,
  className = '',
  emphasis = EMPHASSIS.none,
  icon,
  tabIndex,
  active = false,
}: Props) => {
  const classes = cn(
    {
      'ks-btn': true,
      [`ks-btn--kind-${kind}`]: true,
      [`ks-btn--size-${size}`]: true,
      [`ks-btn--emphasis-${emphasis}`]: true,
      'ks-btn--floating': floating,
      'ks-btn--block': isFullWidth,
      'ks-btn--flush': flush,
      'ks-btn--active': active,
    },
    className,
  );

  const isIconBtn = kind === KINDS.icon || kind === KINDS['icon-standard'];

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={classes}
      disabled={disabled}
      onClick={handleTrigger || onClick}
      onKeyPress={e => {
        // only continue if key is enter or space
        if (
          // enter
          e.which === 13 ||
          // space
          e.which === 32
        ) {
          if (handleTrigger) {
            handleTrigger();
          } else {
            onKeyPress(e);
          }
        }
      }}
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

type GroupProps = {
  children: React.ReactNode;
  isGapless?: boolean;
};
export const KsButtonGroup: React.FC<GroupProps> = ({
  children,
  isGapless = true,
}: GroupProps) => (
  <div
    className={cn('ks-btn-group', {
      'ks-btn-group--is-gapless': isGapless,
    })}
  >
    {children}
  </div>
);
