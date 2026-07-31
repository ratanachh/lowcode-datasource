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

  const URL_PARAMS = {
    name: 'Mechanics Primary School',
    area: 'nanjing',
  };


  const ERROR_MSG = 'test error';

  const urlParamsHandler = sinon.fake(async () => {
    return URL_PARAMS; // TODO: others return a wrapped { data }, why is urlParams different?
  });

  const context = new MockContext<Record<string, unknown>>({}, (ctx) =>
    create(bindRuntimeContext(dataSource, ctx), ctx, {
      requestHandlersMap: {
        urlParams: urlParamsHandler,
      },
    }),
  );

  const setState = sinon.spy(context, 'setState');

  // Should start in initial state
  t.is(context.dataSourceMap.urlParams.status, RuntimeDataSourceStatus.Initial);
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  const reload = context.reloadDataSource();

  // await Promise.all([clock.runAllAsync(), loading]);

  await clock.tickAsync(50);

  t.is(context.dataSourceMap.urlParams.status, RuntimeDataSourceStatus.Loaded);

  await clock.tickAsync(50);

  // Should have a loading state in between
  t.is(context.dataSourceMap.user.isLoading, true);

  // TODO: options are not exposed yet; skip deepEqual for now

  console.log(context.dataSourceMap.user);
  // Check that params are correct
  // t.deepEqual(context.dataSourceMap.user.options.params, {
  //   name: 'Alice',
  //   age: 8
  // });

  await clock.tickAsync(1050);

  // await clock.tickAsync(1050);

  const load = context.dataSourceMap.user.load({
    name: 'Tom',
    age: 30,
    company: 'alibaba'
  });

  await clock.tickAsync(1500);

 // TODO: options are not exposed yet; skip deepEqual for now
  //   // Check that params are correct
  // t.deepEqual(context.dataSourceMap.user.options.params, {
  //   name: 'Tom',
  //   age: 30,
  //   company: 'alibaba'
  // });

  await Promise.all([clock.runAllAsync(), reload]);

  // user should finally succeed with loaded status
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);

};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
