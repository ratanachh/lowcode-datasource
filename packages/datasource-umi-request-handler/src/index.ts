import { RuntimeOptionsConfig } from '@rchh/lowcode-datasource-types';

import request from 'umi-request';
import { RequestOptionsInit, RequestResponse } from 'umi-request/types';

// config reserved for extension
export function createUmiRequestHandler(config?: Record<string, unknown>) {
  // eslint-disable-next-line space-before-function-paren
  return async function (options: RuntimeOptionsConfig) {
    const requestOptions: RequestOptionsInit = {
      ...options,
      // Request method
      method: options.method,
      // Request params
      data: options.params,
      // Request headers
      headers: options.headers as HeadersInit,
      // When designing requestHandlersMap request-behavior instances, extra params can be passed into the request instance
      ...config,
      // 'getResponse': whether to get the raw Response; result will wrap as: { data, response }
      // See: https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
      // Provide as much source data as possible for flexible customization
      getResponse: true,
    };
    const response: RequestResponse = await request(options.uri, requestOptions);
    // Like axios, return options with the response so callers can branch on options
    // https://github.com/axios/axios#response-schema
    return { ...response, options };
  };
}
