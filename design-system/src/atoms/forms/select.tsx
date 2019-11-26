import React, { useEffect, useState } from 'react';
import './select.scss';
import shortid from 'shortid';
import { Icon } from '../icon';

//
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
  value = items.length === 0 ? '' : items[0].value,
}: Props) => {
  const [id, setId] = useState('');
  useEffect(() => {
    setId(`select--${shortid.generate()}`);
  }, []);

  const [currentValue, setValue] = useState(value);

  return (
    <label className="ks-select" htmlFor={id} tabIndex={0}>
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
