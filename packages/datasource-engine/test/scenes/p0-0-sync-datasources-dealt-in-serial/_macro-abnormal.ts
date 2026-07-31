import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@rchh/lowcode-types';
import sinon from 'sinon';

import { bindRuntimeContext, delay, MockContext } from '../../_helpers';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';

export const abnormalScene: Macro<
  [
    {
      create: (dataSource: any, ctx: IDataSourceRuntimeContext, options: any) => IDataSourceEngine;
      dataSource: RuntimeDataSource | InterpretDataSource;
    },
  ]
> = async (t: ExecutionContext<{ clock: SinonFakeTimers }>, { create, dataSource }) => {
  const { clock } = t.context;

  const USER_DATA = {
    id: 9527,
    name: 'Alice',
  };
  const ERROR_MSG = 'test error';
  const fetchHandler = sinon.fake(async ({ uri }) => {
    await delay(100);
    if (/user/.test(uri)) {
      return { data: USER_DATA };
    } else {
      throw new Error(ERROR_MSG);
    }
  });

  const context = new MockContext<Record<string, unknown>>({}, (ctx) =>
    create(bindRuntimeContext(dataSource, ctx), ctx, {
      requestHandlersMap: {
        fetch: fetchHandler,
      },
    }),
  );

  const setState = sinon.spy(context, 'setState');

  // Should start in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await clock.tickAsync(50);

  // Should have a loading state in between
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

  await clock.tickAsync(50);

  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Loading);

  await Promise.all([clock.runAllAsync(), loading]);

  // user should finally succeed with loaded status
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);
  // orders should finally fail with error status
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Error);

  // Check datasource data
  t.deepEqual(context.dataSourceMap.user.data, USER_DATA);
  t.is(context.dataSourceMap.user.error, undefined);
  t.deepEqual(context.dataSourceMap.orders.data, undefined);
  t.not(context.dataSourceMap.orders.error, undefined);
  t.regex(context.dataSourceMap.orders.error!.message, new RegExp(ERROR_MSG));

  // Check state data
  t.assert(setState.callCount > 0);
  t.deepEqual(context.state.user, USER_DATA);
  t.is(context.state.orders, undefined);

  // fetchHandler should have been called 3 times
  t.assert(fetchHandler.calledThrice);

  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  // Check call arguments
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);
};

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
