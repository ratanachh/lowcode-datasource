import { IRuntimeDataSource } from './IRuntimeDataSource';

/** Runtime context */
export interface IRuntimeContext<
  TState = Record<string, unknown>
> {
  /** Datasources, keyed by datasource ID */
  dataSourceMap: Record<string, IRuntimeDataSource>;

  /** Current container state */
  readonly state: TState;

  /** Set state (shallow merge) */
  setState(state: Partial<TState>): void;

  /** Reload all datasources */
  reloadDataSource(): Promise<void>;

  /** Page container */
  readonly page: IRuntimeContext & { props: Record<string, unknown> };

  /** Low-code business component container */
  readonly component: IRuntimeContext & { props: Record<string, unknown> };
}
