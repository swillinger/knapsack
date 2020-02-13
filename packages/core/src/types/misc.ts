export interface GenericResponse<data = object> {
  ok: boolean;
  message?: string;
  data?: data;
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
