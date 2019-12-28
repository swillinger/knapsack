import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './select.scss';
import shortid from 'shortid';
import { Icon } from '../icon';

enum Sizes {
  s = 's',
  m = 'm',
}

// Select.defaultProps = {
//   initialItem: 0,
//   label: '',
// };
//
// Select.propTypes = {
//   items: PropTypes.arrayOf(
//     PropTypes.shape({
//       title: PropTypes.string,
//       value: PropTypes.string.isRequired,
//     }),
//   ).isRequired,
//   handleChange: PropTypes.func.isRequired,
//   initialItem: PropTypes.number,
//   label: PropTypes.string,
// };

type Props = {
  label?: string;
  isLabelInline?: boolean;
  size?: keyof typeof Sizes;
  handleChange: (value: string) => void;
  value?: string;
  items: {
    title?: string;
    value: string;
  }[];
};

export const Select: React.FC<Props> = ({
  label,
  handleChange,
  items,
  size = Sizes.m,
  value = items.length === 0 ? '' : items[0].value,
  isLabelInline = true,
}: Props) => {
  const [id, setId] = useState('');
  useEffect(() => {
    setId(`select--${shortid.generate()}`);
  }, []);

  const [currentValue, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const classes = cn({
    'ks-select': true,
    [`ks-select--size-${size}`]: true,
    'ks-select--label-inline': isLabelInline,
  });
  return (
    <label className={classes} htmlFor={id} tabIndex={0}>
      {label && <div className="ks-select__label-text">{label}</div>}
      <span className="ks-select__wrapper">
        <select
          onChange={event => {
            setValue(event.target.value);
            handleChange(event.target.value);
          }}
          value={currentValue}
          id={id}
          className="ks-select__select"
        >
          {items.map(item => (
            <option tabIndex={0} value={item.value} key={item.value}>
              {item.title ? item.title : item.value}
            </option>
          ))}
        </select>
        <span className="ks-select__icon">
          <Icon size="s" symbol="dropdown-carrot" />
        </span>
      </span>
    </label>
  );
};
