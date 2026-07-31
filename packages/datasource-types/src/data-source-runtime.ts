import { IRuntimeDataSource } from './data-source';
import { CustomRequestHandler } from './data-source-handlers';

// Define runtime-mode types first
export interface RuntimeDataSource {
  list: RuntimeDataSourceConfig[];
  dataHandler?: (dataSourceMap: DataSourceMap) => void;
}

export type DataSourceMap = Record<string, IRuntimeDataSource>;

export interface RuntimeDataSourceConfig {
  id: string;
  isInit?: boolean;
  isSync?: boolean;
  type?: string;
  willFetch?: WillFetch;
  shouldFetch?: (options:RuntimeOptionsConfig) => boolean;
  requestHandler?: CustomRequestHandler;
  dataHandler?: DataHandler;
  errorHandler?: ErrorHandler;
  options?: RuntimeOptions;
  [otherKey: string]: unknown;
}

export type WillFetch = (
  options: RuntimeOptionsConfig,
) => Promise<RuntimeOptionsConfig> | RuntimeOptionsConfig;

export type DataHandler = <T>(response: {
  data: T;
  [index: string]: unknown;
}) => Promise<T | undefined>;

export type ErrorHandler = (err: unknown) => Promise<any>;

export type RuntimeOptions = () => RuntimeOptionsConfig;

export interface RuntimeOptionsConfig {
  uri: string;
  api?: string;
  params?: Record<string, unknown>;
  method?: string;
  isCors?: boolean;
  timeout?: number;
  headers?: Record<string, unknown>;
  [option: string]: unknown;
}

// Can use React state, but a synchronous setState must be provided
export interface IDataSourceRuntimeContext<
  TState extends Record<string, unknown> = Record<string, unknown>
> {
  /** Current datasource content */
  state: TState;
  /** Set state (shallow merge) */
  setState(state: Partial<TState>): void;
}
