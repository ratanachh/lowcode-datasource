import {
  DataHandler,
  RequestHandler,
  RequestHandlersMap,
  RuntimeDataSourceConfig,
  RuntimeOptionsConfig,
  UrlParamsHandler,
  WillFetch,
} from '@rchh/lowcode-types';

// Default dataHandler for a dataSourceItem
export const defaultDataHandler: DataHandler = async <T = unknown>(response: { data: T }) => response.data;

// Default willFetch for a dataSourceItem
export const defaultWillFetch: WillFetch = (options: RuntimeOptionsConfig) => options;

// Default shouldFetch for a dataSourceItem
export const defaultShouldFetch = () => true;

type GetRequestHandler<T = unknown> = (
  ds: RuntimeDataSourceConfig,
  requestHandlersMap: RequestHandlersMap<{ data: T }>,
) => RequestHandler<{ data: T }> | UrlParamsHandler<T>;

// Get requestHandler from the current dataSourceItem
export const getRequestHandler: GetRequestHandler = (ds, requestHandlersMap) => {
  if (ds.type === 'custom') {
    // Custom type handling
    return (ds.requestHandler as unknown) as RequestHandler<{ data: unknown }>; // Cast should be safe; if empty, failure should surface when the request runs
  }
  // Protocol default type is fetch
  return requestHandlersMap[ds.type || 'fetch'];
};

export const promiseSettled =
  (Promise.allSettled ? Promise.allSettled.bind(Promise) : null) ||
  ((promises: Array<Promise<any>>) => {
    return Promise.all(
      promises.map((p) => {
        return p
          .then((v) => ({
            status: 'fulfilled',
            value: v,
          }))
          .catch((e) => ({
            status: 'rejected',
            reason: e,
          }));
      }),
    );
  });
