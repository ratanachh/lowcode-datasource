import { InterpretDataSource } from '@rchh/lowcode-types';

// Datasource schema portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: InterpretDataSource = {
  list: [
    {
      id: 'user',
      type: 'fetch',
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
      },
    },
  ],
};
