import { InterpretDataSource } from '@rchh/lowcode-types';

// Datasource schema portion only:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: InterpretDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'custom',
      isSync: true,
      requestHandler: {
        type: 'JSFunction',
        value: `function(options){
          return new Promise(res => {
            setTimeout(() => {
              // test return data
               res({
                data: {
                  id: 9527,
                  name: 'Alice',
                  uri: options.uri,
                }
              });
            }, 1000);
          });
        }`,
      },
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
        params: {
          age: 8
        }
      },
      willFetch: {
        type: "JSFunction",
        value: `function(options){
          options.params.name = 'Alice';
          return options;
        }`
      }
    }
  ],
};
