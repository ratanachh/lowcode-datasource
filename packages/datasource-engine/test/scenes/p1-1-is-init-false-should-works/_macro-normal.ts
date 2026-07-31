import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@rchh/lowcode-types';
import sinon from 'sinon';

import { bindRuntimeContext, delay, MockContext } from '../../_helpers';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

export const normalScene: Macro<
  [
    {
      create: (dataSource: any, ctx: IDataSourceRuntimeContext, options: any) => IDataSourceEngine;
      dataSource: RuntimeDataSource | InterpretDataSource;
    },
  ]
> = async (t: ExecutionContext<{ clock: SinonFakeTimers }>, { create, dataSource }) => {
  const { clock } = t.context;
  const ORDERS_ERROR_MSG = 'the orders request should not fetch, please check the condition';

  const USER_DATA = {
    name: 'Alice',
    age: 18,
  };

  const fetchHandler = sinon.fake(async () => {
    await delay(100);
    return {
      data: USER_DATA,
    };
  });

  const context = new MockContext<Record<string, unknown>>(
    {},
    (ctx) =>
      create(bindRuntimeContext(dataSource, ctx), ctx, {
        requestHandlersMap: {
          fetch: fetchHandler,
        },
      }),
    {
      recordError() {},
    },
  );

  const setState = sinon.spy(context, 'setState');
  // const recordError = sinon.spy(context, 'recordError');

  // Should start in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await clock.tickAsync(50);

  // isInit is false, so it should not load and remain in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  await clock.tickAsync(50);

  // isInit is false, so it should not load and remain in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  await Promise.all([clock.runAllAsync(), loading]);

  // isInit is false, so it should not load and remain in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  // Check datasource data
  t.is(context.dataSourceMap.user.data, undefined);

  // Check state data
  t.assert(setState.notCalled);
  t.is(context.state.user, undefined);

  // fetchHandler should not have been called
  t.assert(fetchHandler.notCalled);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
