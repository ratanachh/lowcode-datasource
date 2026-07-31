import { RuntimeDataSource } from '@rchh/lowcode-types';

export const DEFAULT_USER_DATA = { id: 0, name: 'guest' }; // Return a fallback payload

// Datasource portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const dataSource: RuntimeDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'fetch',
      options: () => ({
        uri: 'https://mocks.alibaba-inc.com/user.json',
      }),
      dataHandler: function dataHandler(response: any) {
        return response.data;
      },
    },
  ],
};
