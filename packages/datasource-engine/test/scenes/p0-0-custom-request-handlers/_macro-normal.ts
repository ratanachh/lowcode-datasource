import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@rchh/lowcode-types';
import sinon from 'sinon';

import { bindRuntimeContext, MockContext } from '../../_helpers';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';

export const normalScene: Macro<
  [
    {
      create: (dataSource: any, ctx: IDataSourceRuntimeContext, options?: any) => IDataSourceEngine;
      dataSource: RuntimeDataSource | InterpretDataSource;
    },
  ]
> = async (t: ExecutionContext<{ clock: SinonFakeTimers }>, { create, dataSource }) => {
  const { clock } = t.context;

  const USER_DATA = {
    id: 9527,
    name: 'Alice',
    uri: 'https://mocks.alibaba-inc.com/user.json',
  };
  const ERROR_MSG = 'test error';

  const context = new MockContext<Record<string, unknown>>({}, (ctx) =>
    create(bindRuntimeContext(dataSource, ctx), ctx),
  );

  const setState = sinon.spy(context, 'setState');

  // Should start in initial state
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Initial);
  t.is(context.dataSourceMap.members.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await clock.tickAsync(50);

  // Should have a loading state in between
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

  await clock.tickAsync(1050);

  // Should have a loading state in between
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Loading);

  await clock.tickAsync(1050);

  // members fails immediately because there is no requestHandler
  t.is(context.dataSourceMap.members.status, RuntimeDataSourceStatus.Error);

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
  t.deepEqual(context.dataSourceMap.members.data, undefined);
  t.not(context.dataSourceMap.members.error, undefined);
  t.regex(context.dataSourceMap.orders.error!.message, new RegExp(ERROR_MSG));
  t.regex(context.dataSourceMap.members.error!.message, new RegExp('no custom handler provide'));

  // Check state data
  t.deepEqual(setState.callCount, 2);
  t.deepEqual(context.state.user, USER_DATA);
  t.is(context.state.orders, undefined);
  t.is(context.state.members, undefined);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
