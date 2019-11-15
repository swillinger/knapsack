import { KnapsackBrain } from './main-types';

export interface GenericResponse {
  ok: boolean;
  message?: string;
  data?: object;
}

export interface KnapsackMeta {
  websocketsPort?: number;
  knapsackVersion?: string;
  version?: string;
  changelog?: string;
}

export interface RenderResponse {
  ok: boolean;
  html?: string;
  message?: string;
}

export interface GraphQlContext extends KnapsackBrain {
  canWrite: boolean;
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
          enumNames: string[];
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
