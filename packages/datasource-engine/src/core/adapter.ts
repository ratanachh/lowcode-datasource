import { getRuntimeValueFromConfig, getRuntimeJsValue, buildOptions, buildShouldFetch } from './../utils';
// Convert schemas from different channels into types needed at runtime

import {
  DataSourceMap,
  IDataSourceRuntimeContext,
  InterpretDataSource,
  InterpretDataSourceConfig,
  RuntimeDataSourceConfig,
} from '@rchh/lowcode-types';

import { ExtraConfig } from '@rchh/lowcode-datasource-types';


import { defaultDataHandler, defaultWillFetch } from '../helpers';


const adapt2Runtime = (dataSource: InterpretDataSource, context: IDataSourceRuntimeContext, extraConfig: ExtraConfig) => {
  const { list: interpretConfigList, dataHandler: interpretDataHandler } = dataSource;
  const dataHandler: (dataMap?: DataSourceMap) => void = interpretDataHandler
    ? getRuntimeJsValue(interpretDataHandler, context)
    : undefined;

  // Empty check
  if (!interpretConfigList || !interpretConfigList.length) {
    return {
      list: [],
      dataHandler,
    };
  }
  const list: RuntimeDataSourceConfig[] = interpretConfigList.map((el: InterpretDataSourceConfig) => {
    const { defaultDataHandler: customDataHandler } = extraConfig;
    const finalDataHandler = customDataHandler || defaultDataHandler;
    return {
      id: el.id,
      isInit: getRuntimeValueFromConfig('boolean', el.isInit, context), // default true
      isSync: getRuntimeValueFromConfig('boolean', el.isSync, context), // default false
      type: el.type || 'fetch',
      willFetch: el.willFetch ? getRuntimeJsValue(el.willFetch, context) : defaultWillFetch,
      shouldFetch: buildShouldFetch(el, context),
      dataHandler: el.dataHandler ? getRuntimeJsValue(el.dataHandler, context) : finalDataHandler,
      errorHandler: el.errorHandler ? getRuntimeJsValue(el.errorHandler, context) : undefined,
      requestHandler: el.requestHandler ? getRuntimeJsValue(el.requestHandler, context) : undefined,
      options: buildOptions(el, context),
    };
  });

  return {
    list,
    dataHandler,
  };
};

export { adapt2Runtime };
