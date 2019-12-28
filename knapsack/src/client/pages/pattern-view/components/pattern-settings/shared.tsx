import {
  isArrayOfObjectsProp,
  isFunctionProp,
  isOptionsProp,
  isBooleanProp,
  isNumberProp,
  isStringProp,
  PropertyTypes,
  PropTypeNames,
  PropTypeNamesList,
  StringProp,
  JsonSchemaObject,
  OptionsProp,
  PropTypeData,
} from '@knapsack/core/types';
import { KsTemplateSpec, KsSlotInfo } from '../../../../../schemas/patterns';

export enum SpecItemTypes {
  Prop = 'Prop',
  Slot = 'Slot',
}

// export type PropData = {
//   id: string;
//   type: PropTypeNamesList;
//   data: PropertyTypes;
//   isRequired?: boolean;
// };

export type SlotData = {
  id: string;
  data: KsSlotInfo;
};
