import { RuntimeDataSource } from '@rchh/lowcode-types';

// Datasource portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const dataSource: RuntimeDataSource = {
  list: [
    {
      id: 'urlParams',
      isInit: true,
      type: 'urlParams',
    },
  ],
};
