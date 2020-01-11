import React from 'react';
import cn from 'classnames';
import Select, {
  components,
  Theme,
  OptionProps,
  SingleValueProps,
} from 'react-select';
import './select.scss';
import { useFallbackId } from '../../utils/hooks';

enum Sizes {
  s = 's',
  m = 'm',
}

export type SelectOptionProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  /** Pass data in here in `options` and get it back in `handleChange`. You'll lose typing though, but should be to handle that on your end relatively easy with `(meta as MyType)` */
  meta?: {};
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

  const SingleValue = ({
    children,
    ...props
  }: SingleValueProps<SelectOptionProps>) => {
    // `props.options` is ALL and `props.data` is THIS option.
    // I have NO idea why `props.data` contains everything it should BUT `icon` even though in `props.options` it has it but that's what's up.
    // So I use `props.data.value` to find the full object out of `props.options`
    // PS `Option` does not have this problem
    const data = props.options.find(opt => opt.value === props?.data?.value);
    return (
      <components.SingleValue {...props}>
        <div className="ks-select__option">
          {data?.icon && (
            <span className="ks-select__option-icon">{data.icon}</span>
          )}
          <span>{children}</span>
        </div>
      </components.SingleValue>
    );
  };

  const Option = ({ children, ...props }: OptionProps<SelectOptionProps>) => {
    return (
      <components.Option {...props}>
        <div className="ks-select__option">
          {props.data?.icon && (
            <span className="ks-select__option-icon">{props.data.icon}</span>
          )}
          <span>{children}</span>
        </div>
      </components.Option>
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
  };

  const optionsProp = options.map(option => {
    return {
      label: option.value,
      ...option,
    };
  });
  return (
    <label className={classes} htmlFor={id} tabIndex={0}>
      {label && <div className="ks-select__label-text">{label}</div>}
      <span className="ks-select__wrapper">
        <Select
          options={optionsProp}
          onChange={option => {
            handleChange(option as SelectOptionProps);
          }}
          value={value}
          isSearchable={isSearchable}
          isClearable={isClearable}
          placeholder={placeholder}
          id={id}
          className="ks-select__select"
          isDisabled={disabled}
          theme={theme => {
            const theTheme: Theme = {
              ...theme,
              borderRadius: 4, // it wants a number (like `4`) and not a string (like `4px` or `var(--radius-s)`) ¯\_(ツ)_/¯
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
            };

            return theTheme;
          }}
          styles={customStyles}
          components={{
            SingleValue,
            Option,
          }}
        />
      </span>
    </label>
  );
};
