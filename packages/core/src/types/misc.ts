// import { JSONSchema7 } from 'json-schema'; @todo consider using instead; though I'm not seeing it make it's way to the compiled JSON schema themselves via `convert-types-to-json-schmea.js`

export interface GenericResponse {
  ok: boolean;
  message?: string;
  data?: object;
}

type PropBase = {
  title?: string;
  description?: string;
};

type SchemaObject = {
  type: 'object';
  required?: string[];
  properties: {
    [prop: string]: any;
  };
} & PropBase;

type PropertyTypes =
  | ({
      default?: any;
      type: 'string' | 'boolean' | 'number';
    } & PropBase)
  | ({
      default?: any;
      type: 'string';
      enum: string[];
      enumNames?: string[];
    } & PropBase)
  | ({
      typeof: 'function';
      default?: string;
    } & PropBase)
  | SchemaObject
  | ({
      type: 'array';
      items?: SchemaObject;
    } & PropBase);

export type JsonSchemaObject = {
  $schema?: string;
  title?: string;
  description?: string;
  type: string;
  required?: string[];
  properties: {
    [prop: string]: PropertyTypes;
  };
  examples?: {}[];
};
