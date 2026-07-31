/* eslint-disable @typescript-eslint/indent */
import {
  IRuntimeDataSource,
  IDataSourceRuntimeContext,
  RequestHandlersMap,
  RuntimeDataSourceConfig,
  RuntimeDataSource,
  DataHandler,
} from '@rchh/lowcode-types';

import { RuntimeDataSourceItem } from '../core';
import { reloadDataSourceFactory } from '../core/reloadDataSourceFactory';
import { defaultDataHandler, defaultShouldFetch, defaultWillFetch, getRequestHandler } from '../helpers';

/**
 * @param dataSource
 * @param context
 * @param extraConfig: { requestHandlersMap }
 */

export default (
  dataSource: RuntimeDataSource,
  context: IDataSourceRuntimeContext,
  extraConfig: {
    requestHandlersMap: RequestHandlersMap<{ data: unknown }>;
    defaultDataHandler?: DataHandler;
  } = { requestHandlersMap: {} },
) => {
  const { requestHandlersMap } = extraConfig;

  // TODO: For codegen types, add data compatibility and set defaults for required fields; cover a few essentials first
  dataSource.list.forEach((ds) => {
    ds.isInit = (
      typeof ds.isInit === 'function'
        ? (ds as unknown as { isInit(): boolean }).isInit.bind(context)
        : ds.isInit ?? true
    ) as any;
    ds.isSync = ds.isSync ?? false;
    // eslint-disable-next-line no-nested-ternary
    ds.shouldFetch = !ds.shouldFetch
      ? defaultShouldFetch
      : typeof ds.shouldFetch === 'function'
      ? ds.shouldFetch.bind(context)
      : ds.shouldFetch;
    ds.willFetch = ds.willFetch ? ds.willFetch.bind(context) : defaultWillFetch;
    const finalDataHandler = extraConfig.defaultDataHandler || defaultDataHandler;
    ds.dataHandler = ds.dataHandler ? ds.dataHandler.bind(context) : finalDataHandler;
  });

  const dataSourceMap = dataSource.list.reduce(
    (prev: Record<string, IRuntimeDataSource>, current: RuntimeDataSourceConfig) => {
      prev[current.id] = new RuntimeDataSourceItem(current, getRequestHandler(current, requestHandlersMap), context);
      return prev;
    },
    {},
  );

  return {
    dataSourceMap,
    reloadDataSource: reloadDataSourceFactory(dataSource, dataSourceMap, dataSource.dataHandler),
  };
};
