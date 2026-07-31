import { DataSourceMap, RuntimeDataSource, RuntimeDataSourceConfig } from '@rchh/lowcode-types';
import { promiseSettled } from '../helpers';

export const reloadDataSourceFactory = (
  dataSource: RuntimeDataSource,
  dataSourceMap: DataSourceMap,
  dataHandler?: (dataSourceMap: DataSourceMap) => void,
) => {
  return async () => {
    const allAsyncLoadings: Array<Promise<any>> = [];

    // TODO: how should new types be handled here???
    // Handle urlParams type separately
    dataSource.list
      .filter(
        (el: RuntimeDataSourceConfig) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          el.type === 'urlParams' && isInit(el),
      )
      .forEach((el: RuntimeDataSourceConfig) => {
        dataSourceMap[el.id].load();
      });

    const remainRuntimeDataSourceList = dataSource.list.filter(
      (el: RuntimeDataSourceConfig) => el.type !== 'urlParams',
    );

    // Handle parallel loads
    for (const ds of remainRuntimeDataSourceList) {
      if (!ds.options) {
        continue;
      }
      if (
        // Consider codegen cases where the value is omitted
        isInit(ds) &&
        !ds.isSync
      ) {
        allAsyncLoadings.push(dataSourceMap[ds.id].load());
      }
    }

    // Handle serial loads
    for (const ds of remainRuntimeDataSourceList) {
      if (!ds.options) {
        continue;
      }

      if (
        // Consider codegen cases where the value is omitted
        isInit(ds) &&
        ds.isSync
      ) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await dataSourceMap[ds.id].load();
        } catch (e) {
          // TODO: should this error just be swallowed?
          console.error(e);
        }
      }
    }

    await promiseSettled(allAsyncLoadings);

    // After all init requests finish, invoke the hook

    if (dataHandler) {
      dataHandler(dataSourceMap);
    }
  };
};

function isInit(ds: RuntimeDataSourceConfig) {
  return typeof ds.isInit === 'function' ? (ds as unknown as { isInit: () => boolean }).isInit() : ds.isInit ?? true;
}
