## Core design

For extensibility and compatibility, packages are split into two kinds: **datasource-engine** and **datasource-*-handler**. The `*` matches the datasource `type` (for example `datasource-mtop-handler`). Real request logic lives in handlers; the engine lets consumers register only the handlers they need.

That design has two goals:

1. Avoid shipping every handler in one oversized bundle (wasteful for clients).
2. Support new datasource types by adding a handler that follows the existing contract.

![](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/275191/1599545889374-73acbe09-3bb6-4df9-b6f9-80a86764afa2.png?x-oss-process=image%2Fresize%2Cw_720)

### DataSourceEngine

* **engine**: There are two entry points — one for the render engine (`engine/interpret`), and one for code generation / standalone runtime use (`engine/runtime`):

```js
import { createInterpret, createRuntime } from '@rchh/lowcode-datasource-engine';
```

The `create` method is defined as:

```js
interface IDataSourceEngineFactory {
    create(dataSource: DataSource, context: Omit<IRuntimeContext, 'dataSourceMap' | 'reloadDataSource'>, extraConfig?: {
        requestHandlersMap: RequestHandlersMap;
        [key: string]: any;
    }): IDataSourceEngine;
}
```

`create` takes three arguments. The first is `DataSource`. For runtime rendering, the shapes are:

```js
/**
 * Datasource object — runtime rendering
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface DataSource {
    list: DataSourceConfig[];
    dataHandler?: JSFunction;
}
/**
 * Datasource config
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface DataSourceConfig {
    id: string;
    isInit: boolean | JSExpression;
    type: string;
    requestHandler?: JSFunction;
    dataHandler?: JSFunction;
    options?: {
        uri: string | JSExpression;
        params?: JSONObject | JSExpression;
        method?: string | JSExpression;
        isCors?: boolean | JSExpression;
        timeout?: number | JSExpression;
        headers?: JSONObject | JSExpression;
        [option: string]: CompositeValue;
    };
    [otherKey: string]: CompositeValue;
}
```

For code generation, `create` and `DataSource` look like this:

```js
export interface IRuntimeDataSourceEngineFactory {
    create(dataSource: RuntimeDataSource, context: Omit<IRuntimeContext, 'dataSourceMap' | 'reloadDataSource'>, extraConfig?: {
        requestHandlersMap: RequestHandlersMap;
        [key: string]: any;
    }): IDataSourceEngine;
}

export interface RuntimeOptionsConfig {
    uri: string;
    params?: Record<string, unknown>;
    method?: string;
    isCors?: boolean;
    timeout?: number;
    headers?: Record<string, unknown>;
    shouldFetch?: (options: RuntimeDataSourceConfig) => boolean;
    [option: string]: unknown;
}
export declare type RuntimeOptions = () => RuntimeOptionsConfig; // May need dynamic values; resolved to a function at runtime

export interface RuntimeDataSourceConfig {
    id: string;
    isInit: boolean;
    type: string;
    requestHandler?: () => {};
    dataHandler: (data: unknown, err?: Error) => {};
    options?: RuntimeOptions;
    [otherKey: string]: unknown;
}
/**
 * Datasource object
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface RuntimeDataSource {
    list: RuntimeDataSourceConfig[];
    dataHandler?: (dataMap: DataSourceMap) => void;
}
```

The difference is clear: interpret mode keeps JS expression strings from schema JSON; runtime mode uses executable JS. Code generation converts expressions itself; the render engine only receives schema JSON, so the datasource engine performs that conversion.

* **context**: Some expressions use `this` and need a runtime context to evaluate. Handlers may also call context APIs such as `setState`. Context is optional in some cases (covered later).

```js
/**
 * Runtime context — modeled after React, but you can build your own
 */
export interface IRuntimeContext<TState extends object = Record<string, unknown>> {
    /** Current container state */
    readonly state: TState;
    /** Set state (shallow merge) */
    setState(state: Partial<TState>): void;
    /** Custom methods */
    [customMethod: string]: any;
    /** Datasources keyed by datasource ID */
    dataSourceMap: Record<string, IRuntimeDataSource>;
    /** Reload all datasources */
    reloadDataSource(): Promise<void>;
    /** Page container */
    readonly page: IRuntimeContext & {
        readonly props: Record<string, unknown>;
    };
    /** Low-code business component container */
    readonly component: IRuntimeContext & {
        readonly props: Record<string, unknown>;
    };
}
```

* **extraConfig**: Reserved for extension. The required field is **requestHandlersMap**:

```js
export declare type RequestHandler<T = unknown> = (ds: RuntimeDataSourceConfig, context: IRuntimeContext) => Promise<RequestResult<T>>;
export declare type RequestHandlersMap = Record<string, RequestHandler>;
```

`RequestHandlersMap` links datasource types to handlers. Keys match `DataSourceConfig.type` (for example `mtop` / `http` / `jsonp`). At runtime the matching type-handler is invoked with the current options and context.

After `create` returns, you get a `DataSourceEngine` instance:

```js
export interface IDataSourceEngine {
    /** Datasources keyed by datasource ID */
    dataSourceMap: Record<string, IRuntimeDataSource>;
    /** Reload all datasources */
    reloadDataSource(): Promise<void>;
}
```
