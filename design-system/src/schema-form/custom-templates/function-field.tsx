import React, { useRef } from 'react';
import {
  Editor,
  Error,
  useView,
  PropTypes,
  Compiler,
  Placeholder,
  Knobs,
} from 'react-view';
import JsonSchemaForm, {
  FormProps,
  FieldProps,
  ErrorListProps,
} from 'react-jsonschema-form';
import './function-field.scss';

export const FunctionField: React.FC<FieldProps> = (props: FieldProps) => {
  const timeoutId = useRef<any>(null);
  // ensure there is only one `setTimeout` waiting
  if (timeoutId.current) clearTimeout(timeoutId.current);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const typescriptType = props?.schema?.tsType;

  const params = useView({
    props: {
      [props.name]: {
        value: props.formData,
        type: PropTypes.Function,
        description: props.schema.description
          ? `${typescriptType}\n${props.schema.description}`
          : typescriptType,
      },
    },
  });

  const hasError = params.knobProps?.error?.where === props.name;
  const newValue = params.knobProps?.state?.[props.name]?.value;

  // When a single keystroke happens, two renders happen back to back. If everything validates, we don't need to worry about anything, however if there was an error these are the two renders:
  // 1) `hasError` is `false`, but `newValue` contains a syntax error and will crash the app if we call `props.onChange(newValue)`. so we delay the update with `setTimeout`
  // 2) `hasError` is `true`, so use that info to stop the delayed `props.onChange` call.
  if (hasError) {
    clearTimeout(timeoutId.current);
  } else {
    timeoutId.current = setTimeout(() => {
      // only trigger a change if there was one
      if (newValue !== props.formData) {
        props.onChange(newValue);
      }
      timeoutId.current = null;
    }, 10); // `0` worked but I want to give it a bit of space
  }

  return (
    <div
      className={`ks-rjsf__function-field ks-rjsf__function-field--${props.name}`}
    >
      <Knobs {...params.knobProps} />
    </div>
  );
};
