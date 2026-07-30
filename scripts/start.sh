#!/usr/bin/env bash

lerna exec --scope @rchh/lowcode-datasource-engine -- npm build
lerna exec --scope @rchh/lowcode-datasource-fetch-handler -- npm build
lerna exec --scope @rchh/lowcode-datasource-jsonp-handler -- npm start
lerna exec --scope @alilc/lowcode-datasource-mopen-handler -- npm start
lerna exec --scope @alilc/lowcode-datasource-mtop-handler -- npm start
lerna exec --scope @rchh/lowcode-datasource-types -- npm start
lerna exec --scope @alilc/lowcode-datasource-universal-mtop-handler -- npm start
lerna exec --scope @rchh/lowcode-datasource-url-params-handler -- npm start
