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

export const normalScene: Macro<
  [
    {
      create: (dataSource: any, ctx: IDataSourceRuntimeContext, options: any) => IDataSourceEngine;
      dataSource: RuntimeDataSource | InterpretDataSource;
    },
  ]
> = async (t: ExecutionContext<{ clock: SinonFakeTimers }>, { create, dataSource }) => {
  const { clock } = t.context;

  const USER_DATA = {
    name: 'Alice',
    age: 18,
  };

  const fetchHandler = sinon.fake(async () => {
    await delay(100);
    return {
      data: {
        success: true,
        data: USER_DATA,
      },
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
  const recordError = sinon.spy(context, 'recordError');

  // Should start in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await clock.tickAsync(50);

  // Should have a loading state in between
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

  await Promise.all([clock.runAllAsync(), loading]);

  // Should finally succeed with loaded status
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);

  // Check datasource data
  t.deepEqual(context.dataSourceMap.user.data, USER_DATA);
  t.deepEqual(context.dataSourceMap.user.error, undefined);

  // Check state data
  t.assert(setState.callCount > 0);
  t.deepEqual(context.state.user, USER_DATA);

  // fetchHandler should have been called once
  t.assert(fetchHandler.calledOnce);

  // Check call arguments
  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);

  // Analytics/tracking should not have been called
  t.assert(recordError.notCalled);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
