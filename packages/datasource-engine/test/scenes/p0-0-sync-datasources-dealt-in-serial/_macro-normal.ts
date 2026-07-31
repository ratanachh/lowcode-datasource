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

import { buildOptions } from '../../../src/utils';

export const normalScene: Macro<[
  {
    create: (
      dataSource: any,
      ctx: IDataSourceRuntimeContext,
      options: any
    ) => IDataSourceEngine;
    dataSource: RuntimeDataSource | InterpretDataSource;
  }
]> = async (
  t: ExecutionContext<{ clock: SinonFakeTimers }>,
  { create, dataSource },
  ) => {
    const { clock } = t.context;

    const USER_DATA = {
      id: 9527,
      name: 'Alice',
    };

    const ORDERS_DATA = [{ id: 123 }, { id: 456 }];

    const fetchHandler = sinon.fake(async ({ uri }) => {
      await delay(100);
      return { data: /user/.test(uri) ? USER_DATA : ORDERS_DATA };
    });

    const context = new MockContext<Record<string, unknown>>({}, (ctx) => create(bindRuntimeContext(dataSource, ctx), ctx, {
      requestHandlersMap: {
        fetch: fetchHandler,
      },
    }));

    const setState = sinon.spy(context, 'setState');

    // Should start in initial state
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);
    t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Initial);
    t.is(context.dataSourceMap.orderList.status, RuntimeDataSourceStatus.Initial);

    const loading = context.reloadDataSource();

    await clock.tickAsync(50);

    // Should have a loading state in between
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

    await clock.tickAsync(50);

    t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Loading);
    await clock.tickAsync(150);

    t.is(context.dataSourceMap.orderList.status, RuntimeDataSourceStatus.Loading);

    await Promise.all([clock.runAllAsync(), loading]);

    // Should finally succeed with loaded status
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);
    t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Loaded);
    t.is(context.dataSourceMap.orderList.status, RuntimeDataSourceStatus.Loaded);

    // Check datasource data
    t.deepEqual(context.dataSourceMap.user.data, USER_DATA);
    t.deepEqual(context.dataSourceMap.user.error, undefined);
    t.deepEqual(context.dataSourceMap.orders.data, ORDERS_DATA);
    t.deepEqual(context.dataSourceMap.orders.error, undefined);

    t.assert(setState.calledThrice);
    // Check state data
    t.deepEqual(context.state.user, USER_DATA);
    t.deepEqual(context.state.orders, ORDERS_DATA);

    // fetchHandler should have been called 3 times
    t.assert(fetchHandler.calledThrice);

    // Check call arguments
    const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
    const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
    // const thriceListItemOptions = DATA_SOURCE_SCHEMA.list[2].options;
    t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);
    t.is(context.dataSourceMap.orderList._options.params, fetchHandler.thirdCall.args[0].params)
  };

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
