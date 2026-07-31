import { RuntimeDataSource } from '@rchh/lowcode-types';

// Datasource portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const dataSource: RuntimeDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'custom',
      isSync: true,
      requestHandler: options => {
        return new Promise(res => {
          setTimeout(() => {
            // test return data
            res({
              data: {
                id: 9527,
                name: 'Alice',
                uri: options.uri,
              },
            });
          }, 1000);
        });
      },
      options() {
        return {
          uri: 'https://mocks.alibaba-inc.com/user.json',
        };
      },
    },
    {
      id: 'orders',
      isInit: true,
      type: 'custom',
      isSync: true,
      requestHandler: () => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            // test return data
            rej(new Error('test error'));
          }, 1000);
        });
      },
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
      // This API is fake and unreachable; this scene intentionally needs an error
      id: 'members',
      isInit: true,
      type: 'custom',
      isSync: true,
      options() {
        return {
          uri: 'https://mocks.alibaba-inc.com/members.json',
        };
      },
    },
  ],
};
