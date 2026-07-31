/* eslint-disable @typescript-eslint/indent */
import merge from 'lodash/merge';
import {
  IDataSourceRuntimeContext,
  IRuntimeDataSource,
  RequestHandler,
  RuntimeDataSourceConfig,
  RuntimeDataSourceStatus,
  RuntimeOptionsConfig,
  UrlParamsHandler,
} from '@rchh/lowcode-types';

class RuntimeDataSourceItem<TParams extends Record<string, unknown> = Record<string, unknown>, TResultData = unknown>
  implements IRuntimeDataSource<TParams, TResultData> {
  private _data?: TResultData;

  private _error?: Error;

  private _status = RuntimeDataSourceStatus.Initial;

  private _dataSourceConfig: RuntimeDataSourceConfig;

  private _request: RequestHandler<{ data: TResultData }> | UrlParamsHandler<TResultData>;

  private _context: IDataSourceRuntimeContext;

  private _options?: RuntimeOptionsConfig;

  constructor(
    dataSourceConfig: RuntimeDataSourceConfig,
    request: RequestHandler<{ data: TResultData }> | UrlParamsHandler<TResultData>,
    context: IDataSourceRuntimeContext,
  ) {
    this._dataSourceConfig = dataSourceConfig;
    this._request = request;
    this._context = context;
  }

  get data() {
    return this._data;
  }

  get error() {
    return this._error;
  }

  get status() {
    return this._status;
  }

  get isLoading() {
    return this._status === RuntimeDataSourceStatus.Loading;
  }

  async load(params?: TParams) {
    if (!this._dataSourceConfig) return;
    // Consider the case where no matching handler is bound
    if (!this._request) {
      this._error = new Error(`no ${this._dataSourceConfig.type} handler provide`);
      this._status = RuntimeDataSourceStatus.Error;
      throw this._error;
    }

    // TODO: urlParams — is there a better way to handle this?
    if (this._dataSourceConfig.type === 'urlParams') {
      const response = await (this._request as UrlParamsHandler<TResultData>)(this._context);
      this._context.setState({
        [this._dataSourceConfig.id]: response,
      });

      this._data = response;
      this._status = RuntimeDataSourceStatus.Loaded;
      return response;
    }

    if (!this._dataSourceConfig.options) {
      throw new Error(`${this._dataSourceConfig.id} has no options`);
    }

    if (typeof this._dataSourceConfig.options === 'function') {
      this._options = this._dataSourceConfig.options();
    }

    // Consider the case where options become null after transform
    if (!this._options) {
      throw new Error(`${this._dataSourceConfig.id} options transform error`);
    }

    // Temporary locals — results may differ each time, so do not cache
    let shouldFetch = true;
    let fetchOptions = this._options;

    // If load has params, merge them first, then use the merged options for shouldFetch / willFetch
    if (params) {
      fetchOptions.params = merge(fetchOptions.params, params);
    }

    if (this._dataSourceConfig.shouldFetch) {
      if (typeof this._dataSourceConfig.shouldFetch === 'function') {
        shouldFetch = this._dataSourceConfig.shouldFetch(fetchOptions);
      } else if (typeof this._dataSourceConfig.shouldFetch === 'boolean') {
        shouldFetch = this._dataSourceConfig.shouldFetch;
      }
    }

    if (!shouldFetch) {
      this._status = RuntimeDataSourceStatus.Error;
      this._error = new Error(`the ${this._dataSourceConfig.id} request should not fetch, please check the condition`);
      console.warn(this.error);
      return;
    }

    // willFetch takes current options; if load has params, they are merged into options.params
    if (this._dataSourceConfig.willFetch) {
      try {
        fetchOptions = await this._dataSourceConfig.willFetch(this._options);
      } catch (error) {
        console.error(error);
      }
    }

    const dataHandler = this._dataSourceConfig.dataHandler!;
    const { errorHandler } = this._dataSourceConfig;

    // Invoke the actual request and assign data/status onto the current dataSource
    try {
      this._status = RuntimeDataSourceStatus.Loading;

      // _context is always passed; whether the handler uses it is up to the handler
      const result = await (this._request as RequestHandler<{
        data: TResultData;
      }>)(fetchOptions, this._context).then(dataHandler, errorHandler);

      // Assign result
      this._data = result;
      this._status = RuntimeDataSourceStatus.Loaded;

      // setState
      this._context.setState({
        UNSTABLE_dataSourceUpdatedAt: Date.now(),
        [this._dataSourceConfig.id]: result,
      });

      return this._data;
    } catch (error) {
      this._error = error as Error;
      this._status = RuntimeDataSourceStatus.Error;

      // setState
      this._context.setState({
        UNSTABLE_dataSourceUpdatedAt: Date.now(),
        [`UNSTABLE_${this._dataSourceConfig.id}_error`]: error,
      });

      throw error;
    }
  }
}

export { RuntimeDataSourceItem };
