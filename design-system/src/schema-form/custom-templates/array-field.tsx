import React from 'react';
import PropTypes from 'prop-types';
import { FormIconButton } from './form-icon-button';
import { FormArrayItem } from './form-array-item';
import { FormIconTray } from './form-icon-tray';

import upArrow from '../assets/angle-up.svg';
import downArrow from '../assets/angle-down.svg';
import add from '../assets/plus-square-o.svg';
import remove from '../assets/trash.svg';

export default function CustomArrayField(props) {
  const numberofItems = props.items.length;
  return (
    <div id={`field-array--${props.idSchema.$id}`} className={props.className}>
      <details open={props.uiSchema['ui:detailsOpen'] === true}>
        <summary>{props.title}</summary>
        {props.items &&
          props.items.map(element => (
            <FormArrayItem key={element.index}>
              <p className="n-of-x">
                {element.index + 1} / {numberofItems}
              </p>
              {element.children}
              <FormIconTray className="field-array__item-button-tray">
                <FormIconButton
                  active={element.hasMoveUp}
                  backgroundImage={upArrow}
                  onKeyPress={element.onReorderClick(
                    element.index,
                    element.index - 1,
                  )}
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1,
                  )}
                  ariaLabel="move item up"
                />
                <FormIconButton
                  active={element.hasMoveDown}
                  backgroundImage={downArrow}
                  onKeyPress={element.onReorderClick(
                    element.index,
                    element.index + 1,
                  )}
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1,
                  )}
                  ariaLabel="move item down"
                />
                <FormIconButton
                  active
                  backgroundImage={remove}
                  onClick={element.onDropIndexClick(element.index)}
                  onKeyPress={element.onDropIndexClick(element.index)}
                  ariaLabel="remove item"
                />
              </FormIconTray>
            </FormArrayItem>
          ))}
        {props.canAdd && (
          <FormIconTray style={{ marginTop: '5px' }}>
            <FormIconButton
              backgroundImage={add}
              onClick={props.onAddClick}
              onKeyPress={props.onAddClick}
              ariaLabel="add new item"
            />
          </FormIconTray>
        )}
      </details>
    </div>
  );
}

CustomArrayField.defaultProps = {
  uiSchema: {
    'ui:detailsOpen': false,
  },
};

CustomArrayField.propTypes = {
  /* eslint-disable-next-line react/boolean-prop-naming */
  canAdd: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  idSchema: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.object,
};
