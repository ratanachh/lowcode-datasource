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
