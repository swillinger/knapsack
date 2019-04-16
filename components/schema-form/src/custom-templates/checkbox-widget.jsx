import React from 'react';
import PropTypes from 'prop-types';
import { Toggle } from '@knapsack/atoms';

function CheckboxWidget(props) {
  const {
    // schema,
    id,
    value,
    required,
    disabled,
    readonly,
    // label,
    onBlur,
    onFocus,
    onChange,
  } = props;
  return (
    <div className={`checkbox ${disabled || readonly ? 'disabled' : ''}`}>
      <Toggle>
        <label htmlFor={id} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id={id}
            checked={typeof value === 'undefined' ? false : value}
            required={required}
            disabled={disabled || readonly}
            onChange={event => onChange(event.target.checked)}
            onBlur={onBlur && (event => onBlur(id, event.target.checked))}
            onFocus={onFocus && (event => onFocus(id, event.target.checked))}
          />
          <span className="checkbox-toggler" />
          {/* <span className="checkbox-label">{label}</span> */}
        </label>
      </Toggle>
    </div>
  );
}

CheckboxWidget.defaultProps = {};

/* eslint-disable */
if (process.env.NODE_ENV !== 'production') {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
  };
}
/* eslint-enable */

export default CheckboxWidget;
