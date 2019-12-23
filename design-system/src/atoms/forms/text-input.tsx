import React from 'react';
import cn from 'classnames';
import './text-input.scss';
import { Icon, Props as IconProps } from '../icon';
import { useFallbackId } from '../../utils/hooks';

type Props = {
  label?: string;
  placeholder?: string;
  isLabelInline?: boolean;
  inlineLabelWidth?: string;
  inputProps?: any;
  type?: string;
  description?: string;
  error?: string;
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
  error,
  description,
  flush,
  endIcon,
}: Props) => {
  const id = useFallbackId();

  const classes = cn({
    'ks-text-field': true,
    'ks-text-field--inline': isLabelInline,
    'ks-text-field--has-error': error,
    'ks-text-field--has-label': label,
    'ks-text-field--flush': flush,
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
          'ks-text-field__inline-wrapper': isLabelInline,
          'ks-text-field__input-icon-wrapper': endIcon,
        })}
      >
        <input
          className="ks-text-field__input"
          id={id}
          type={type}
          placeholder={placeholder}
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
