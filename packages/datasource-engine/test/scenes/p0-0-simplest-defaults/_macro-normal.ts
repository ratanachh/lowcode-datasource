import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@rchh/lowcode-types';
import sinon from 'sinon';

import { delay, MockContext } from '../../_helpers';
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
    return { data: USER_DATA };
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

  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  // Check call arguments
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
