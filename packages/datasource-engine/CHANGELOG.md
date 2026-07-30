# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.1](https://github.com/alibaba/lowcode-datasource/compare/v1.2.0...v1.2.1) (2024-09-24)

**Note:** Version bump only for package @rchh/lowcode-datasource-engine





# [1.2.0](https://github.com/alibaba/lowcode-datasource/compare/v1.1.4...v1.2.0) (2024-07-03)


### Features

* 🎸 支持用户自定义defaultDataHandler,避免默认都返回了 res.data ([add3c1e](https://github.com/alibaba/lowcode-datasource/commit/add3c1e05e44e6a199f505cac3b657ba3c5e18a8))
* 🎸 remove mtop & mopen packages ([f517771](https://github.com/alibaba/lowcode-datasource/commit/f517771d3832734cba06c9ca5590a054d55a6fd0))





# [1.1.0](https://github.com/alibaba/lowcode-datasource/compare/v1.0.1...v1.1.0) (2022-06-20)


### Features

* 🎸 为数据源引擎增加 module 入口, 以便支持 vite 和 snowpack 等现代构建工具 ([9e37434](https://github.com/alibaba/lowcode-datasource/commit/9e3743423471e9e11e2181b401f6f54b4e3dc726))





## [1.0.1](https://github.com/alibaba/lowcode-datasource/compare/v1.0.0...v1.0.1) (2022-03-17)


### Bug Fixes

* 🐛 修复部分异常JSExpression返回值，减少Error ([3107aad](https://github.com/alibaba/lowcode-datasource/commit/3107aad3735379c28aef6d1d971c6ffb76ef9508))





# 1.0.0 (2022-02-15)


### Features

* 🎸 提交开源版本 ([453516f](https://github.com/alibaba/lowcode-datasource/commit/453516ffcb25868a6d6f380ec8967a36bb474089))





# [1.0.0](https://github.com/alibaba/lowcode-datasource/compare/v1.0.0-beta.0...v1.0.0) (2022-02-15)


### Features

* 🎸 开源版本代码提交 ([22ae404](https://github.com/alibaba/lowcode-datasource/commit/22ae404e624b66e0c9dc18aa4b3a9b6195149136))
* 🎸 提交开源版本 ([22a338a](https://github.com/alibaba/lowcode-datasource/commit/22a338a989356cc0f58b276ab3062904b5f005c3))





# [1.0.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.0-beta.0...v1.0.0) (2022-02-15)


### Features

* 🎸 开源版本代码提交 ([22ae404](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/22ae404e624b66e0c9dc18aa4b3a9b6195149136))





# [1.0.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.29...v1.0.0) (2022-01-20)


### Bug Fixes

* 🐛 修复参数深度合并问题 ([e1868b5](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/e1868b5120dffc798c6278ea016c424a536e3b2a))


### Features

* 🎸 开源新包 ([16c5589](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/16c558982f852a009a2c48af7c84629865f0fa7f))





## [1.0.26-alpha.2](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.26-alpha.1...v1.0.26-alpha.2) (2021-12-14)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.26-alpha.1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.26-alpha.0...v1.0.26-alpha.1) (2021-12-12)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.26-alpha.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.25-alpha.0...v1.0.26-alpha.0) (2021-12-12)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.25-alpha.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24...v1.0.25-alpha.0) (2021-12-12)


### Bug Fixes

* 🐛 修复load时params跟willfetch无关问题 ([83992c7](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/83992c7475b62e75b9f366b9282d538428d081e5))





## [1.0.24](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.14...v1.0.24) (2021-10-08)


### Bug Fixes

* 🐛 解决 isInit=false 的时候通过 interpret 模式却还自动加载了数据源的问题 ([c010512](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/c01051210b349ef8da53403fdf296b005eac7c78))
* 🐛 修复运行时 isInit 配置为 false 但是依然还是会加载数据源的问题 ([703d7e3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/703d7e3e0259fde9908b5efde5e0a2f52157b0ef))





## [1.0.24-beta.14](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.13...v1.0.24-beta.14) (2021-03-18)


### Bug Fixes

* 🐛 修复 buildJsonObj 对于 JSONObject 类型的解析 ([a4bcff5](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/a4bcff584ba7c328dcc7c9f4c7f27864b7386d29))
* 🐛 数据源出现错误状态的时候也应该触发下页面重绘, 临时用 setState 搞下, 后面再讨论下如何搞 ([23b680a](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/23b680aa140573fa94953779aaba34ef4c26299f))
* 🐛 解决 TypeError: #<Object> is not a constructor ([8478c33](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/8478c33af3dc50704fa10cd76d72767e31c46a96))
* 🐛 解决数据源状态改变后没有触发页面渲染的问题 ([66351de](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/66351deb72df2f1417891bc5f39d7b0d7ecad9ea))



## [1.0.24-hotfix-runtime.1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.10...v1.0.24-hotfix-runtime.1) (2021-01-14)


### Bug Fixes

* 解决 runtime 模式下设置 isInit=false 不生效的问题 ([1f8109c](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/1f8109c83aa54df9188d51536b7a95d20742879b))





## [1.0.24-beta.10](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.9...v1.0.24-beta.10) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.9](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.8...v1.0.24-beta.9) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.7...v1.0.24-beta.8) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.7](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.6...v1.0.24-beta.7) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.6...v1.0.24-beta.1) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.6...v1.0.24-beta.0) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.6](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.5...v1.0.24-beta.6) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.5](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.4...v1.0.24-beta.5) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.4](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.3...v1.0.24-beta.4) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.3...v1.0.24-beta.0) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.2...v1.0.24-beta.3) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.2](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.1...v1.0.24-beta.2) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## [1.0.24-beta.1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/compare/v1.0.24-beta.0...v1.0.24-beta.1) (2020-12-09)

**Note:** Version bump only for package @ali/lowcode-datasource-engine





## 1.0.24-beta.0 (2020-12-09)


### Bug Fixes

* replace promise.allsettled ([afad34c](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-datasource/commit/afad34c159c05823a482bcbf991c6b9075ae80cc))





<a name="1.0.22"></a>
## [1.0.22](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.21...@ali/lowcode-datasource-engine@1.0.22) (2020-11-16)


### Bug Fixes

* datasource engine adpater ([52d0d88](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/52d0d88))




<a name="1.0.21"></a>
## [1.0.21](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.20...@ali/lowcode-datasource-engine@1.0.21) (2020-11-10)


### Bug Fixes

* 合并数据源引擎修复代码 ([53f3554](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/53f3554))




<a name="1.0.20"></a>
## [1.0.20](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.18...@ali/lowcode-datasource-engine@1.0.20) (2020-11-10)


### Bug Fixes

* add package json typings ([6378595](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/6378595))
* datasource package.json files 新增lib文件 ([a8a1749](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/a8a1749))


### Features

* update datasource engine ([bf7b7d1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/bf7b7d1))




<a name="1.0.18"></a>
## [1.0.18](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.17...@ali/lowcode-datasource-engine@1.0.18) (2020-11-05)


### Bug Fixes

* datasource版本错误问题 ([a247878](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/a247878))




<a name="1.0.17"></a>
## [1.0.17](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.16...@ali/lowcode-datasource-engine@1.0.17) (2020-11-05)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="1.0.16"></a>
## [1.0.16](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.15...@ali/lowcode-datasource-engine@1.0.16) (2020-11-05)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="1.0.15"></a>
## [1.0.15](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@1.0.14...@ali/lowcode-datasource-engine@1.0.15) (2020-11-04)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="1.0.14"></a>
## [1.0.14](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.17...@ali/lowcode-datasource-engine@1.0.14) (2020-11-04)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="1.0.13"></a>
## [1.0.13](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.17...@ali/lowcode-datasource-engine@1.0.13) (2020-11-04)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="0.1.17"></a>
## [0.1.17](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.16...@ali/lowcode-datasource-engine@0.1.17) (2020-11-02)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="0.1.16"></a>
## [0.1.16](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.15...@ali/lowcode-datasource-engine@0.1.16) (2020-10-20)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="0.1.15"></a>
## [0.1.15](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.14...@ali/lowcode-datasource-engine@0.1.15) (2020-10-19)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="0.1.14"></a>
## [0.1.14](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.13...@ali/lowcode-datasource-engine@0.1.14) (2020-09-29)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="0.1.13"></a>
## [0.1.13](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-datasource-engine@0.1.12...@ali/lowcode-datasource-engine@0.1.13) (2020-09-28)




**Note:** Version bump only for package @ali/lowcode-datasource-engine

<a name="0.1.12"></a>
## 0.1.12 (2020-09-28)


### Features

* 🎸 按 826 对齐结论调整出码和数据源引擎 ([b9a562e](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b9a562e))
* 🎸 添加数据源引擎 ([624e2f8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/624e2f8))
* 🎸 与国凯的数据源保持一致,将 urlParams 所需的 search 参数直接传入 ([19fabc1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/19fabc1))
