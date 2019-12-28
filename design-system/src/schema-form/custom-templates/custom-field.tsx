import React from 'react';
import cn from 'classnames';
import { FieldTemplateProps } from 'react-jsonschema-form';
import { FaInfoCircle } from 'react-icons/fa';
import { RadioInputWrapper, TextInputWrapper, Tooltip } from '../../atoms';
import { Icon } from '../../atoms/icon';
import './custom-field.scss';

/* eslint-disable react/prop-types */
export default function CustomField(props: FieldTemplateProps) {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    errors,
    children,
    rawErrors,
  } = props;
  const fieldDescription = description.props?.description;
  const inputSchema = children?.props?.schema;
  let inputContent = <div />;
  const textWrapperInputs = ['string', 'integer', 'number'];
  const uiSchema = children?.props?.uiSchema;
  if (
    inputSchema?.type === 'string' &&
    !!inputSchema.enum &&
    !!uiSchema['ui:widget']
  ) {
    inputContent = <RadioInputWrapper>{children}</RadioInputWrapper>;
  } else if (inputSchema?.type === 'string' && !!inputSchema.enum) {
    inputContent = (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label className="ks-select__label" tabIndex={0}>
        <span className="ks-select__wrapper ks-select__wrapper--variant">
          {children}
          <span className="ks-select__icon">
            <Icon size="s" symbol="dropdown-carrot" />
          </span>
        </span>
      </label>
    );
    // } else if (textWrapperInputs.includes(inputSchema?.type)) {
  } else {
    inputContent = (
      <div className="ks-text-field--size-s">
        <div className="ks-text-input-wrapper ks-text-field__wrapper">
          {children}
        </div>
      </div>
    );
    // inputContent = children;
  }
  /* eslint-disable no-alert, jsx-a11y/label-has-for */
  return (
    <div
      className={cn(`ks-custom-field`, classNames, {
        'ks-custom-field--has-errors': rawErrors?.length > 0,
      })}
    >
      <label htmlFor={id} className="ks-field-label">
        {label}
        {label && required ? '*' : null}
        {fieldDescription && (
          <Tooltip tooltipContent={fieldDescription} position="top">
            <FaInfoCircle className="ks-custom-field__info-icon" />
          </Tooltip>
        )}
      </label>
      {inputContent}
      {errors && errors}
      {help}
    </div>
  );
}
