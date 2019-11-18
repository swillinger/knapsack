import React from 'react';
import { FormIconButton } from './form-icon-button';
import { FormArrayItem } from './form-array-item';
import { FormIconTray } from './form-icon-tray';

import upArrow from '../assets/angle-up.svg';
import downArrow from '../assets/angle-down.svg';
import add from '../assets/plus-square-o.svg';
import remove from '../assets/trash.svg';

type Props = {
  canAdd: boolean;
  className: string;
  idSchema: {
    $id: string;
  };
  items: any[]; // @todo
  onAddClick: () => {};
  title: string;
  uiSchema?: object;
};

const CustomArrayField: React.FC<Props> = ({
  canAdd,
  className,
  idSchema,
  items,
  onAddClick,
  title,
  uiSchema = {
    'ui:detailsOpen': false,
  },
}: Props) => {
  const numberofItems = items.length;
  return (
    <div id={`ks-field-array--${idSchema.$id}`} className={className}>
      <details open={uiSchema['ui:detailsOpen'] === true}>
        <summary>{title}</summary>
        {items &&
          items.map(element => (
            <FormArrayItem key={element.index}>
              <p className="ks-n-of-x">
                {element.index + 1} / {numberofItems}
              </p>
              {element.children}
              <FormIconTray className="ks-field-array__item-button-tray">
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
        {canAdd && (
          <FormIconTray style={{ marginTop: '5px' }}>
            <FormIconButton
              backgroundImage={add}
              onClick={onAddClick}
              onKeyPress={onAddClick}
              ariaLabel="add new item"
            />
          </FormIconTray>
        )}
      </details>
    </div>
  );
};

export default CustomArrayField;
