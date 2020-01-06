import React from 'react';
import cn from 'classnames';
import Select, { components } from 'react-select';
import './select.scss';
import { useFallbackId } from '../../utils/hooks';

enum Sizes {
  s = 's',
  m = 'm',
}

export type SelectOptionProps = {
  label?: string;
  value: string;
  [key: string]: any;
};

type Props = {
  label?: string;
  id?: string;
  /**
   * Display the label inline with the input? Defaults to false (label above the input).
   */
  isLabelInline?: boolean;
  size?: keyof typeof Sizes;
  handleChange: (option: SelectOptionProps) => void;
  /**
   * Add ability to search the options.
   */
  isSearchable?: boolean;
  /**
   * Provide an X button to clear the input.
   */
  isClearable?: boolean;
  /**
   * If the select menu is displaying a list of statuses.
   * If so, you can pass `color` values in for each option and a status dot will display with each.
   */
  isStatusList?: boolean;
  /**
   * If the select menu is displaying a list of renderer engines (react, web components, etc).
   * If so, each option may have a meta.iconSvg to be displayed to the left of the option label.
   */
  isRendererList?: boolean;
  placeholder?: string;
  value?: SelectOptionProps;
  options: SelectOptionProps[];
  disabled?: boolean;
};

export const KsSelect: React.FC<Props> = ({
  label,
  id: userId,
  handleChange,
  isSearchable = false,
  isClearable = false,
  isStatusList = false,
  isRendererList = false,
  placeholder = 'Select...',
  options,
  size = Sizes.m,
  value = options.length === 0 ? null : options[0],
  isLabelInline = false,
  disabled = false,
}: Props) => {
  let id = useFallbackId();
  id = userId ?? id;

  const classes = cn({
    'ks-select': true,
    [`ks-select--size-${size}`]: true,
    'ks-select--label-inline': isLabelInline,
    'ks-select--disabled': disabled,
  });

  const statusDot = (color = 'var(--c-frame)') => ({
    display: 'flex',
    alignItems: 'center',

    ':before': {
      content: '" "',
      backgroundColor: color,
      border: '1px solid var(--c-bg)',
      borderRadius: 'var(--space-xs)',
      boxSizing: 'content-box',
      display: 'block',
      marginRight: 'var(--space-xs)',
      height: 'var(--space-xs)',
      width: 'var(--space-xs)',
      minWidth: 'var(--space-xs)', // prevents flexbox collapsing pseudo element when text is long
    },
  });

  const customSingleValue = ({ children, ...props }) => {
    return isRendererList ? (
      <components.SingleValue {...props}>
        <div className="ks-select__option--has-icon">
          {props.data.meta?.iconSvg && (
            <span
              className="ks-select__option--has-icon__icon"
              dangerouslySetInnerHTML={{ __html: props.data.meta.iconSvg }}
            />
          )}
          <span>{children}</span>
        </div>
      </components.SingleValue>
    ) : (
      <components.SingleValue {...props}>{children}</components.SingleValue>
    );
  };

  const customOption = ({ children, ...props }) => {
    return isRendererList ? (
      <components.Option {...props}>
        <div className="ks-select__option--has-icon">
          {props.data.meta?.iconSvg && (
            <span
              className="ks-select__option--has-icon__icon"
              dangerouslySetInnerHTML={{ __html: props.data.meta.iconSvg }}
            />
          )}
          <span>{children}</span>
        </div>
      </components.Option>
    ) : (
      <components.Option {...props}>{children}</components.Option>
    );
  };

  const customStyles = {
    dropdownIndicator: provided => ({
      ...provided,
      padding: size === 's' ? '0 var(--space-xxxs)' : 'var(--space-xs)',
    }),
    indicatorSeparator: provided => ({
      ...provided,
      marginTop: size === 's' ? 'var(--space-xxs)' : 'var(--space-xs)',
      marginBottom: size === 's' ? 'var(--space-xxs)' : 'var(--space-xs)',
    }),
    menu: provided => ({
      ...provided,
      zIndex: 100,
    }),
    singleValue: (provided, { data }) => ({
      ...provided,
      ...(isStatusList && statusDot(data.color)),
    }),
    option: (provided, { data }) => ({
      ...provided,
      ...(isStatusList && statusDot(data.color)),
    }),
  };

  return (
    <label className={classes} htmlFor={id} tabIndex={0}>
      {label && <div className="ks-select__label-text">{label}</div>}
      <span className="ks-select__wrapper">
        <Select
          options={options.map(option => {
            return {
              label: option.value,
              ...option,
            };
          })}
          onChange={option => {
            // setCurrentValue(event);
            handleChange(option);
          }}
          value={value}
          isSearchable={isSearchable}
          isClearable={isClearable}
          placeholder={placeholder}
          id={id}
          className="ks-select__select"
          isDisabled={disabled}
          theme={theme => ({
            ...theme,
            borderRadius: 'var(--space-xxs)',
            colors: {
              ...theme.colors,
              primary: 'var(--c-focus)', // focus and active option
              primary75: 'var(--c-focus)',
              primary50: 'var(--c-active-highlight)',
              primary25: 'var(--c-active-highlight)', // option hover state
              neutral0: 'var(--c-bg)', // bg color
              // neutral5: ,
              // neutral10: ,
              neutral20: 'var(--c-frame)', // input border
              neutral30: 'var(--c-frame)', // input border hover
              // neutral40: ,
              // neutral50: ,
              neutral60: 'var(--c-text-subdued)', // dropdown caret
              // neutral70: ,
              // neutral80: ,
              // neutral90: ,
            },
            spacing: {
              baseUnit: 4,
              controlHeight: size === 'm' ? 40 : 24,
              menuGutter: size === 'm' ? 8 : 2,
            },
          })}
          styles={customStyles}
          components={{ SingleValue: customSingleValue, Option: customOption }}
        />
      </span>
    </label>
  );
};
