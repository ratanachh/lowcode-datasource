import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@rchh/lowcode-types';
import sinon from 'sinon';

import { delay, MockContext } from '../../_helpers';
// import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

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
    throw new Error(ERROR_MSG);
  });

  const context = new MockContext<Record<string, unknown>>({}, (ctx) =>
    create(dataSource, ctx, {
      requestHandlersMap: {
        fetch: fetchHandler,
      },
    }),
  );

  const setState = sinon.spy(context, 'setState');

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
  t.deepEqual(setState.callCount, 1);
  t.deepEqual(context.state.user, undefined);

  // fetchHandler should not have been called
  t.assert(fetchHandler.calledOnce);
};

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
