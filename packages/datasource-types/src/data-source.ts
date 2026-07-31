import { RequestHandlersMap } from './data-source-handlers';
import {
  IDataSourceRuntimeContext,
  RuntimeDataSource,
} from './data-source-runtime';

export type DataSourceOptions<TParams = Record<string, unknown>> = {
  [key: string]: unknown;
  uri?: string;
  params?: TParams;
  method?: string;
  isCors?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
  isSync?: boolean;
};

/** Datasource status */
export enum RuntimeDataSourceStatus {
  /** Initial state, not yet loaded */
  Initial = 'init',

  /** Loading */
  Loading = 'loading',

  /** Loaded (no error) */
  Loaded = 'loaded',

  /** Load failed */
  Error = 'error',
}

/**
 * Runtime datasource (public interface)
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#Jwgj5
 */
export interface IRuntimeDataSource<TParams = unknown, TResultData = unknown> {
  /** Current status (initial/loading/loaded/error) */
  readonly status: RuntimeDataSourceStatus;

  /** Data when load succeeds */
  readonly data?: TResultData;

  /** Error when load fails */
  readonly error?: Error;

  /** Whether currently loading */
  readonly isLoading?: boolean;

  /**
   * Load data (whether or not it has been loaded before).
   * Note: if params are provided, they are shallow-merged with the default config params;
   * otherwise the default config params are used.
   */
  load(params?: TParams): Promise<TResultData | void>;
}

/**
 * DataSourceEngineFactory
 * Factory function type for defining the engine
 */
export interface IRuntimeDataSourceEngineFactory {
  create(
    dataSource: RuntimeDataSource,
    context: IDataSourceRuntimeContext,
    extraConfig?: {
      requestHandlersMap: RequestHandlersMap;
      [key: string]: any;
    },
  ): IDataSourceEngine;
}

// DataSourceEngine returned by create
export interface IDataSourceEngine {
  /** Datasources, keyed by datasource ID */
  dataSourceMap: Record<string, IRuntimeDataSource>;

  /** Reload all datasources */
  reloadDataSource(): Promise<void>;
}
