import webpackConfigExtra from '@alife/scu-default-config/lib/webpack-config-extra'
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const publicPathPre = 'http://daily-oss.jv.fliggy.com/fotelSmartman/';
const publicPathPub = 'http://public-oss.futurehotel.com/fotelSmartman/';
// 额外的配置
module.exports = function (webpackConfig, env) {
  webpackConfig = webpackConfigExtra(webpackConfig, env);
  //本地调试不需要定义静态变量地址
  const nowEnv = process.env.NOW_ENV
  console.log('当前publick引用地址分支',process.env.NOW_VERSION)
  if(nowEnv === 'prepub') {
    webpackConfig.output.publicPath = `${publicPathPre}${process.env.NOW_VERSION}/`
  } else if(nowEnv === 'publish') {
    webpackConfig.output.publicPath = `${publicPathPub}${process.env.NOW_VERSION}/`
  }

  webpackConfig.output.chunkFilename = '[name].js'
  console.log('模块名称配置chunkFilename ',webpackConfig.output.chunkFilename)
  // webpackConfig.entry.vendor = ['react','react-dom','react-router-dom','dva','dva-model-extend','lodash']
  // webpackConfig.plugins = webpackConfig.plugins.concat([
  //   new CommonsChunkPlugin({
  //     name:"vendor",
  //     minChunks:2
  //   }),
  //   new CommonsChunkPlugin({
  //     name: 'manifest',
  //     chunks: ['vendor']
  //   }),
  // ])
  return webpackConfig;
}

