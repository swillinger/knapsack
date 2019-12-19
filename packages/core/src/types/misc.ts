// import { JSONSchema7 } from 'json-schema'; @todo consider using instead; though I'm not seeing it make it's way to the compiled JSON schema themselves via `convert-types-to-json-schmea.js`

export interface GenericResponse {
  ok: boolean;
  message?: string;
  data?: object;
}

type Props =
  | {
      title?: string;
      description?: string;
      default?: any;
      type: 'string' | 'boolean' | 'number';
    }
  | {
      title?: string;
      description?: string;
      default?: any;
      type: 'string';
      enum: string[];
      enumNames?: string[];
    }
  | {
      typeof: 'function';
      title?: string;
      description?: string;
      default?: string;
    }
  | {
      title?: string;
      description?: string;
      type: 'array';
      items?: JsonSchemaObject;
    };

export type JsonSchemaObject = {
  $schema?: string;
  title?: string;
  description?: string;
  type: string;
  required?: string[];
  properties: Record<string, Props | JsonSchemaObject>;
  examples?: {}[];
};
