import { RuntimeDataSourceStatus } from './RuntimeDataSourceStatus';
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
  load(params?: TParams): Promise<TResultData>;
}
