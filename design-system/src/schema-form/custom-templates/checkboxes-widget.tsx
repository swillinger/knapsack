import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { Toggle } from '../../atoms';

function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

function CheckboxesWidget(props) {
  const { id, disabled, options, value, readonly, onChange } = props;
  const { enumOptions, enumDisabled, inline } = options;
  return (
    <div
      className="checkboxes"
      id={id}
      style={
        inline
          ? {
              display: 'flex',
              flexWrap: 'wrap',
            }
          : {}
      }
    >
      {enumOptions.map((option, index) => {
        const checked = value.indexOf(option.value) !== -1;
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1;
        const disabledCls =
          disabled || itemDisabled || readonly ? 'disabled' : '';
        const itemId = `${id}_${index}_${shortid.generate()}`;
        return (
          <div
            style={{
              marginRight: '.75rem',
            }}
            key={itemId}
          >
            <Toggle>
              <label
                className={
                  inline
                    ? `checkbox-inline ${disabledCls}`
                    : `checkbox ${disabledCls}`
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '.75rem',
                }}
                htmlFor={itemId}
              >
                <input
                  type="checkbox"
                  id={itemId}
                  checked={checked}
                  disabled={disabled || itemDisabled || readonly}
                  onChange={event => {
                    const all = enumOptions.map(e => e.value);
                    if (event.target.checked) {
                      onChange(selectValue(option.value, value, all));
                    } else {
                      onChange(deselectValue(option.value, value));
                    }
                  }}
                />
                <span className="checkbox-toggler" />
                <span className="checkbox-label">{option.label}</span>
              </label>
            </Toggle>
          </div>
        );
      })}
    </div>
  );
}

CheckboxesWidget.defaultProps = {
  autofocus: false,
  options: {
    inline: false,
  },
};

/* eslint-disable */
if (process.env.NODE_ENV !== 'production') {
  CheckboxesWidget.propTypes = {
    // schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      enumDisabled: PropTypes.any, // @todo update to correct type
      inline: PropTypes.bool,
    }),
    value: PropTypes.any,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}
/* eslint-enable */

export default CheckboxesWidget;
