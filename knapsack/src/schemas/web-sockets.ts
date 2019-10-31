import { EVENTS } from '../lib/constants';

const { PATTERN_TEMPLATE_CHANGED, PATTERN_ASSET_CHANGED } = EVENTS;

export const WS_EVENTS = {
  [PATTERN_TEMPLATE_CHANGED]: PATTERN_TEMPLATE_CHANGED,
  [PATTERN_ASSET_CHANGED]: PATTERN_ASSET_CHANGED,
};

export type WebSocketEvent = keyof typeof WS_EVENTS;

export interface PatternChangedData {
  /**
   * Absolute path to template on server that was just edited
   */
  path: string;
}

export interface AssetChangedData {
  /**
   * Absolute path to asset file (CSS/JS) on server that was just edited
   */
  path: string;
}

export interface WebSocketMessage {
  event: WebSocketEvent;
  data: PatternChangedData | AssetChangedData;
}
