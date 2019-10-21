export interface GenericResponse {
  ok: boolean;
  message?: string;
  data?: object;
}

export interface KnapsackMeta {
  websocketsPort: number;
  knapsackVersion: string;
  version?: string;
  changelog?: string;
}

export interface RenderResponse {
  ok: boolean;
  html?: string;
  message?: string;
}
