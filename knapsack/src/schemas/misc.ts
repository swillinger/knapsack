import { GenericResponse } from '@knapsack/core/dist/types';
import { KnapsackFile } from '@knapsack/core/dist/cloud';
import { KnapsackBrain } from './main-types';

export { KnapsackFile, GenericResponse };

export interface KnapsackDb<T> {
  savePrep(data: T): Promise<KnapsackFile[]>;
  getData(): Promise<T>;
}

export interface KnapsackDataStoreSaveBody {
  state: import('../client/store').AppState;
  title?: string;
  message?: string;
  storageLocation: 'local' | 'cloud';
}

export interface KnapsackMeta {
  serverPort: number;
  websocketsPort: number;
  knapsackVersion: string;
  version?: string;
  hasKnapsackCloud: boolean;
  /**
   * Absolute path to directory where Knapsack can keep it's own files
   */
  cacheDir: string;
}

export interface GraphQlContext extends KnapsackBrain {
  canWrite: boolean;
}

export type FileResponse = GenericResponse<{
  publicPath: string;
  mimetype: string;
  /**
   * File size in bytes
   */
  size: number;
  originalName: string;
  filename: string;
}>;
