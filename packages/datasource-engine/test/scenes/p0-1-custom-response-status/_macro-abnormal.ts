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
  const ERROR_MSG = 'test error';
  const fetchHandler = sinon.fake(async () => {
    await delay(100);
    return {
      data: {
        success: false,
        message: ERROR_MSG,
        code: 'E_FOO',
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

  // Should finally fail with error status
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Error);

  // Check datasource data
  t.deepEqual(context.dataSourceMap.user.data, undefined);
  t.not(context.dataSourceMap.user.error, undefined);

  t.regex(context.dataSourceMap.user.error!.message, new RegExp(ERROR_MSG));

  // Check state data
  t.assert(setState.callCount > 0);
  t.deepEqual(context.state.user, undefined);

  // fetchHandler should have been called once
  t.assert(fetchHandler.calledOnce);

  // Check call arguments
  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);

  // Analytics/tracking should also have been called
  t.assert(recordError.calledOnce);
  t.snapshot(recordError.firstCall.args);
};

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
