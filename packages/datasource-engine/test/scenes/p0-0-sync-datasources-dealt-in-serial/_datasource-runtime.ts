import { RuntimeDataSource } from '@rchh/lowcode-types';

// Datasource portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const dataSource: RuntimeDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'fetch',
      isSync: true,
      options() {
        return {
          uri: 'https://mocks.alibaba-inc.com/user.json',
        };
      },
    },
    {
      id: 'orders',
      isInit: true,
      type: 'fetch',
      isSync: true,
      options() {
        return {
          uri: 'https://mocks.alibaba-inc.com/orders.json',
          params: {
            userId: this.state.user.id,
          },
        };
      },
    },
    {
      id: 'orderList',
      isInit: true,
      type: 'fetch',
      isSync: true,
      options() {
        return {
          uri: 'https://mocks.alibaba-inc.com/orders.json',
          params: {
            keyword: this.state.user.id
          }
        }
      },
    },
  ],
};
