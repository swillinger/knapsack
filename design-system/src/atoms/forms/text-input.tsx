import React from 'react';
import cn from 'classnames';
import './text-input.scss';
import { Icon, Props as IconProps } from '../icon';
import { useFallbackId } from '../../utils/hooks';

enum Sizes {
  s = 's',
  m = 'm',
}

type Props = {
  label?: string;
  placeholder?: string;
  isLabelInline?: boolean;
  inlineLabelWidth?: string;
  inputProps?: any;
  type?: string;
  handleChange?: (text: string) => void;
  value?: string;
  description?: string;
  error?: string;
  size?: keyof typeof Sizes;
  flush?: boolean;
  endIcon?: IconProps['symbol'];
};

export const KsTextField: React.FC<Props> = ({
  label,
  type = 'text',
  placeholder,
  isLabelInline = false,
  inlineLabelWidth,
  inputProps = {},
  size = Sizes.m,
  error,
  description,
  flush,
  handleChange = () => {},
  value = '',
  endIcon,
}: Props) => {
  const id = useFallbackId();

  const classes = cn({
    'ks-text-field': true,
    'ks-text-field--inline': isLabelInline,
    'ks-text-field--has-error': error,
    'ks-text-field--has-label': label,
    'ks-text-field--flush': flush,
    [`ks-text-field--size-${size}`]: true,
  });

  return (
    <div className={classes}>
      {label && (
        <label
          className="ks-text-field__label"
          htmlFor={id}
          style={{ width: inlineLabelWidth || 'auto' }}
        >
          {label}
        </label>
      )}

      <div
        className={cn({
          'ks-text-field__wrapper': true,
          'ks-text-field__wrapper--inline': isLabelInline,
          'ks-text-field__inline-wrapper': isLabelInline,
          'ks-text-field__wrapper--icon': endIcon,
          'ks-text-field__input-icon-wrapper': endIcon,
        })}
      >
        <input
          className="ks-text-field__input"
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={event => handleChange(event.target.value)}
          {...inputProps}
        />

        {endIcon && (
          <span className="ks-text-field__end-icon">
            <Icon symbol={endIcon} />
          </span>
        )}

        {description && (
          <p className="ks-text-field__description">{description}</p>
        )}
        {error && <div className="ks-text-field__error">{error}</div>}
      </div>
    </div>
  );
};
