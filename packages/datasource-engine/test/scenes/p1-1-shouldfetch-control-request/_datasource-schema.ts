import { InterpretDataSource } from '@rchh/lowcode-types';

// Datasource schema portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: InterpretDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'fetch',
      isSync: true,
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
      },
    },
    {
      id: 'orders',
      isInit: true,
      type: 'fetch',
      isSync: true,
      shouldFetch: {
        type: 'JSFunction',
        value: `
        function (){
          return false;
        }
        `,
      },
      options: {
        uri: 'https://mocks.alibaba-inc.com/orders.json',
        params: {
          type: 'JSExpression',
          value: '{ userId: this.state.user.id }',
        },
      },
    },
  ],
};
