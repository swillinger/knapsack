import { apiUrlBase } from '../../lib/constants';

export const endpoint = `${apiUrlBase}/plugins`;

export enum ACTIONS {
  getContent = 'getContent',
}

export interface GetContentRequest {
  type: ACTIONS.getContent;
  pluginId: string;
}

export interface GetContentResponse {
  type: ACTIONS.getContent;
  ok: boolean;
  message?: string;
  payload: object;
}

export type ActionRequests = GetContentRequest;

export type ActionResponses = GetContentResponse;
