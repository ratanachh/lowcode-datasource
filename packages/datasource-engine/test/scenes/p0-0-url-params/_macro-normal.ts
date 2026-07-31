import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@rchh/lowcode-types';
import sinon from 'sinon';

import { MockContext } from '../../_helpers';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';

export const normalScene: Macro<
  [
    {
      create: (dataSource: any, ctx: IDataSourceRuntimeContext, options: any) => IDataSourceEngine;
      dataSource: RuntimeDataSource | InterpretDataSource;
    },
  ]
> = async (t: ExecutionContext<{ clock: SinonFakeTimers }>, { create, dataSource }) => {
  const { clock } = t.context;

  const URL_PARAMS = {
    name: 'Alice',
    age: '18',
  };

  const urlParamsHandler = sinon.fake(async () => {
    return URL_PARAMS; // TODO: others return a wrapped { data }, why is urlParams different?
  });

  const context = new MockContext<Record<string, unknown>>({}, (ctx) =>
    create(dataSource, ctx, {
      requestHandlersMap: {
        urlParams: urlParamsHandler,
      },
    }),
  );

  const setState = sinon.spy(context, 'setState');

  // Should start in initial state
  t.is(context.dataSourceMap.urlParams.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await Promise.all([clock.runAllAsync(), loading]);

  // Should finally succeed with loaded status
  t.is(context.dataSourceMap.urlParams.status, RuntimeDataSourceStatus.Loaded);

  // Check datasource data
  t.deepEqual(context.dataSourceMap.urlParams.data, URL_PARAMS);
  t.deepEqual(context.dataSourceMap.urlParams.error, undefined);

  // Check state data
  t.assert(setState.callCount > 0);
  t.deepEqual(context.state.urlParams, URL_PARAMS);

  // fetchHandler should have been called once
  t.assert(urlParamsHandler.calledOnce);

  // Check call args; urlParams has no options
  t.deepEqual(urlParamsHandler.firstCall.args, [context]);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
