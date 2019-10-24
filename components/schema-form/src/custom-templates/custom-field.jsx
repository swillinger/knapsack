import React from 'react';
import {
  RadioInputWrapper,
  SelectStyledWrapper,
  TextInputWrapper,
  Tooltip,
} from '@knapsack/atoms';
import { FaInfoCircle } from 'react-icons/fa';
import './custom-field.scss';

/* eslint-disable react/prop-types */
export default function CustomField(props) {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    errors,
    children,
  } = props;
  const fieldDescription = description.props.description;
  const inputSchema = children.props.schema;
  let inputContent = <div />;
  const textWrapperInputs = ['string', 'integer', 'number'];
  const uiSchema = children.props.uiSchema ? children.props.uiSchema : {};
  if (
    inputSchema.type === 'string' &&
    !!inputSchema.enum &&
    !!uiSchema['ui:widget']
  ) {
    inputContent = <RadioInputWrapper>{children}</RadioInputWrapper>;
  } else if (inputSchema.type === 'string' && !!inputSchema.enum) {
    inputContent = (
      <SelectStyledWrapper>
        <span>{children}</span>
      </SelectStyledWrapper>
    );
  } else if (textWrapperInputs.includes(inputSchema.type)) {
    inputContent = <TextInputWrapper>{children}</TextInputWrapper>;
  } else {
    inputContent = children;
  }

  /* eslint-disable no-alert, jsx-a11y/label-has-for */
  return (
    <div className={`custom-field ${classNames}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {label && required ? '*' : null}
        {fieldDescription && (
          <Tooltip tooltipContent={fieldDescription} position="top">
            <FaInfoCircle className="custom-field__info-icon" />
          </Tooltip>
        )}
      </label>
      {inputContent}
      {errors && errors}
      {help}
    </div>
  );
}
