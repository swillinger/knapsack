// import { JSONSchema7 } from 'json-schema'; @todo consider using instead; though I'm not seeing it make it's way to the compiled JSON schema themselves via `convert-types-to-json-schmea.js`

type PropBase = {
  title?: string;
  description?: string;
  default?: any;
};

export enum PropTypeNames {
  'string' = 'string',
  'boolean' = 'boolean',
  'number' = 'number',
  'object' = 'object',
  'options' = 'options',
  'function' = 'function',
  'array' = 'array',
  'arrayOfObjects' = 'arrayOfObjects',
  'arrayOfStrings' = 'arrayOfStrings',
  'unknown' = 'unknown',
}
export type PropTypeNamesList = keyof typeof PropTypeNames;

export type StringProp = {
  type: 'string';
} & PropBase;

export type BooleanProp = {
  type: 'boolean';
} & PropBase;

export type NumberProp = {
  type: 'number';
} & PropBase;

export type OptionsProp = {
  type: 'string';
  enum: string[];
  enumNames?: string[];
} & PropBase;

export type FunctionProp = {
  typeof: 'function';
  default?: string;
} & PropBase;

export type ObjectProp = {
  type: 'object';
  required?: string[];
  properties: {
    [prop: string]: any;
  };
} & PropBase;

export type ArrayProp = {
  type: 'array';
} & PropBase;

export type ArrayOfStringsProp = {
  type: 'array';
  items: StringProp;
} & PropBase;

export type ArrayOfObjectsProp = {
  type: 'array';
  items: ObjectProp;
} & PropBase;

export type PropertyTypes =
  | StringProp
  | BooleanProp
  | NumberProp
  | OptionsProp
  | FunctionProp
  | ObjectProp
  | ArrayOfObjectsProp
  | ArrayOfStringsProp
  | ArrayProp;

export const isStringProp = (prop: PropertyTypes): prop is StringProp =>
  'type' in prop && prop.type === 'string' && !('enum' in prop);
export const isNumberProp = (prop: PropertyTypes): prop is NumberProp =>
  'type' in prop && prop.type === 'number';
export const isBooleanProp = (prop: PropertyTypes): prop is BooleanProp =>
  'type' in prop && prop.type === 'boolean';
export const isOptionsProp = (prop: PropertyTypes): prop is OptionsProp =>
  'enum' in prop;
export const isFunctionProp = (prop: PropertyTypes): prop is FunctionProp =>
  'typeof' in prop && prop?.typeof === 'function';
export const isArrayOfObjectsProp = (
  prop: PropertyTypes,
): prop is ArrayOfObjectsProp =>
  'type' in prop &&
  prop.type === 'array' &&
  'items' in prop &&
  prop.items.type === 'object';
export const isArrayOfStringsProp = (
  prop: PropertyTypes,
): prop is ArrayOfStringsProp =>
  'type' in prop &&
  prop.type === 'array' &&
  'items' in prop &&
  prop.items.type === 'string';

export interface PropTypeDataBase {
  type: any;
  id: string;
  isRequired?: boolean;
  data: any;
}

interface StringPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.string;
  data: StringProp;
}

interface BooleanPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.boolean;
  data: BooleanProp;
}

interface NumberPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.number;
  data: NumberProp;
}

interface OptionsPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.options;
  data: OptionsProp;
}

interface FunctionPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.function;
  data: FunctionProp;
}

interface ObjectPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.object;
  data: ObjectProp;
}

interface ArrayOfObjectsPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.arrayOfObjects;
  data: ArrayOfObjectsProp;
}

interface ArrayOfStringsPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.arrayOfStrings;
  data: ArrayOfStringsProp;
}

interface ArrayPropTypeData extends PropTypeDataBase {
  type: typeof PropTypeNames.array;
  data: ArrayProp;
}

export type PropTypeData =
  | StringPropTypeData
  | BooleanPropTypeData
  | NumberPropTypeData
  | OptionsPropTypeData
  | FunctionPropTypeData
  | ObjectPropTypeData
  | ArrayOfObjectsPropTypeData
  | ArrayOfStringsPropTypeData;
// | ArrayPropTypeData;

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
