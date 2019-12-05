export interface GenericResponse {
  ok: boolean;
  message?: string;
  data?: object;
}

export interface JsonSchemaObject {
  $schema?: string;
  title?: string;
  description?: string;
  type: 'object';
  required?: string[];
  properties: {
    [prop: string]:
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
          title?: string;
          description?: string;
          type: 'array';
          items?: JsonSchemaObject;
        }
      | JsonSchemaObject;
  };
}
