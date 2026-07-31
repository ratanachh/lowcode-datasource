import { IRuntimeDataSource } from './IRuntimeDataSource';

export interface IDataSourceEngine {
  /** Datasources, keyed by datasource ID */
  readonly dataSourceMap: Record<string, IRuntimeDataSource>;

  /** Reload all datasources */
  reloadDataSource(): Promise<void>;
}
