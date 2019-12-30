export interface GenericResponse {
  ok: boolean;
  message?: string;
  data?: object;
}

export interface KnapsackFile {
  contents: string;
  path: string;
  encoding: 'utf8' | 'base64';
  /**
   * File should be deleted
   */
  isDeleted?: boolean;
}
