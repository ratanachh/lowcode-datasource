## About @rchh/lowcode-datasource-engine

Core datasource engine for the LowCode Engine.

## Docs

[Design overview](https://yuque.antfin-inc.com/docs/share/6ba9dab7-0712-4302-a5bb-b17d4a5f8505?# 《DataSource Engine》)

[Fetch flow](https://yuque.antfin-inc.com/docs/share/e9baef9a-3586-40fc-8708-eaeee0d7937e?# Fetch flow)

## Usage

```ts
// For runtime rendering — pass schema as-is
import { create } from '@rchh/lowcode-datasource-engine/interpret';

// For code generation — pass already-transformed config
import { create } from '@rchh/lowcode-datasource-engine/runtime';

import { createFetchHandler } from '@rchh/lowcode-datasource-fetch-handler';

import { createMtopHandler } from '@alilc/lowcode-datasource-mtop-handler';

// dataSource can be schema protocol content or runtime-transformed config (codegen)

// context (setState is required)
const dataSourceEngine = create(dataSource, context, {
  requestHandlersMap: { // optional; defaults shown below
    urlParams: handlersMap.urlParams('?bar=1&test=2'),
    fetch: createFetchHandler,
    mtop: createMtopHandler
  },
});

console.log(dsf.dataSourceMap) // datasourceMap per protocol https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#QUSn5

dsf.dataSourceMap['id'].load() // load

dsf.dataSourceMap['id'].status // status

dsf.dataSourceMap['id'].data // data

dsf.dataSourceMap['id'].error // error

dsf.reloadDataSource(); // reload all datasources
```
