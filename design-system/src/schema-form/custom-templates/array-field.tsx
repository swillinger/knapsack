import React from 'react';
import cn from 'classnames';
import { ArrayFieldTemplateProps as Props } from 'react-jsonschema-form';
import { FormIconButton } from './form-icon-button';
import './form-array-item.scss';
import { FormIconTray } from './form-icon-tray';

import upArrow from '../assets/angle-up.svg';
import downArrow from '../assets/angle-down.svg';
import add from '../assets/plus-square-o.svg';
import remove from '../assets/trash.svg';

const CustomArrayField: React.FC<Props> = ({
  canAdd,
  className,
  idSchema,
  items = [],
  onAddClick,
  title,
  schema,
  uiSchema = {
    'ui:detailsOpen': false,
    'ui:detailsWrap': true,
  },
}: Props) => {
  const isArrayOfStrings =
    typeof schema?.items !== 'boolean' && !Array.isArray(schema?.items)
      ? schema?.items?.type === 'string'
      : false;
  const isInline = isArrayOfStrings;
  const detailsWrap = uiSchema['ui:detailsWrap'] ?? true;
  const detailsOpen = uiSchema['ui:detailsOpen'] ?? false;
  const numberofItems = items.length;
  const content = (
    <>
      {items.map(element => (
        <div
          key={element.index}
          className={cn('ks-form-array-item', {
            'ks-form-array-item--inline': isInline,
          })}
        >
          {!isInline && (
            <p className="ks-n-of-x">
              {element.index + 1} / {numberofItems}
            </p>
          )}
          {element.children}
          <FormIconTray className="ks-field-array__item-button-tray">
            <FormIconButton
              active={element.hasMoveUp}
              backgroundImage={upArrow}
              onKeyPress={element.onReorderClick(
                element.index,
                element.index - 1,
              )}
              onClick={element.onReorderClick(element.index, element.index - 1)}
              ariaLabel="move item up"
            />
            <FormIconButton
              active={element.hasMoveDown}
              backgroundImage={downArrow}
              onKeyPress={element.onReorderClick(
                element.index,
                element.index + 1,
              )}
              onClick={element.onReorderClick(element.index, element.index + 1)}
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
        </div>
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
    </>
  );

  return (
    <div id={`ks-field-array--${idSchema.$id}`} className={className}>
      {detailsWrap ? (
        <details open={detailsOpen}>
          <summary>{title}</summary>
          {content}
        </details>
      ) : (
        content
      )}
    </div>
  );
};

export default CustomArrayField;
