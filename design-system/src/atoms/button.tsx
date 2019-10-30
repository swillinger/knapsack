import React from 'react';
import './button.scss';

type Btn = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type Props = {
  children?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: Btn['onClick'];
  onKeyPress?: Btn['onKeyPress'];
  // onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  // type?: 'button' | 'submit' | 'reset';
  type?: Btn['type'];
  style?: Btn['style'];
  tabIndex?: number;
};

export const Button: React.FC<Props> = ({
  style = {},
  type = 'button',
  className = '',
  disabled = false,
  onClick,
  onKeyPress,
  primary,
  tabIndex,
  children,
}: Props) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={`k-btn
        ${className}
        ${primary ? 'k-btn--primary' : ''}`}
      disabled={disabled}
      onClick={onClick}
      onKeyPress={onKeyPress}
      style={style}
      type={type}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
};
