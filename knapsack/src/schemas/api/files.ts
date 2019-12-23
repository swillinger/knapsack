import { GenericResponse } from '../misc';
import { apiUrlBase } from '../../lib/constants';

export const endpoint = `${apiUrlBase}/files`;

export enum ACTIONS {
  verify = 'verify',
  saveTemplateDemo = 'saveTemplateDemo',
  deleteTemplateDemo = 'deleteTemplateDemo',
}

export interface VerifyData {
  type: ACTIONS.verify;
  payload: {
    path: string;
    alias?: string;
  };
}

export interface VerifyDataResponse {
  type: ACTIONS.verify;
  payload: {
    exists: boolean;
    path: string;
  };
}

export interface SaveTemplateDemo {
  type: ACTIONS.saveTemplateDemo;
  payload: {
    patternId: string;
    templateId: string;
    demoId: string;
    code: string;
  };
}

export interface SaveTemplateDemoResponse {
  type: ACTIONS.saveTemplateDemo;
  payload: GenericResponse;
}

export interface DeleteTemplateDemo {
  type: ACTIONS.deleteTemplateDemo;
  payload: {
    path: string;
  };
}

export interface DeleteTemplateDemoResponse {
  type: ACTIONS.deleteTemplateDemo;
  payload: GenericResponse;
}

export type Actions = VerifyData | SaveTemplateDemo | DeleteTemplateDemo;
export type ActionResponses =
  | VerifyDataResponse
  | SaveTemplateDemoResponse
  | DeleteTemplateDemoResponse;
