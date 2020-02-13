import { LazyExoticComponent, ComponentType, FC } from 'react';
import { KnapsackBrain } from './main-types';

type StoreType = import('../client/store').StoreType;

export enum Navs {
  // 'secondary' = 'secondary',
  'primary' = 'primary',
  'primarySub' = 'primarySub',
}

export type KsPluginPageProps<T> = { content: T; isYolo?: boolean };
export type KsPluginPage<T> = FC<KsPluginPageProps<T>>;
export interface KsPluginPageConfig<T = any> {
  path: string;
  title?: string;
  section?: string;
  navItem?: {
    nav: keyof typeof Navs;
    title: string;
  };
  /**
   * A lazy loaded React component
   * @example const Page = React.lazy(() => import('./page'))
   */
  Page: LazyExoticComponent<KsPluginPage<T>>;
}

export interface KsClientPlugin<T = any> {
  id: string;
  title?: string;
  description?: string;
  addPages?: () => KsPluginPageConfig<T>[];
}

export interface KsClientPluginContext {
  store: StoreType;
}

export type KsPluginLoadFunc<T = any> = (
  context: KsClientPluginContext,
) => KsClientPlugin<T>;

export interface KsServerPlugin<T = any> {
  id: string;
  title?: string;
  description?: string;
  /**
   * An absolute path to a directory that will be the public directory for the plugin, accessible at: `/plugins/ID`
   */
  publicDir?: string;
  /**
   * Subpath for a browser `import()` to get a default export that is a function that returns a `KsClientPlugin`.
   * Must be inside `publicDir`
   * Passing `'client/index.js'` in a plugin with id "hi" would be retrieved via `import('/plugins/hi/client.js')`
   * @example `'client/index.js'`
   */
  clientPluginPath?: string;
  /**
   * Plugins receive brain after core brain and template renderers have fired `init()`
   */
  init?(
    /**
     * The Knapsack Brain
     */
    brain: KnapsackBrain,
  ): Promise<void>;
  loadContent?(): Promise<T>;
}
