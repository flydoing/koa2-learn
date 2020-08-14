'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml') // require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const PagePlugin = require('./page-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{ from: '/html5/pages/', to: path.posix.join(config.dev.assetsPublicPath, 'mobile.html') }, { from: '/html5/', to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
      // aggregeateTimeout: 500, // 防止重复按键，500毫秒内算按键一次
      // ignored: /node_modules/
    }
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': require('../config/dev.env') }),
    new PagePlugin(config.dev.cdns),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'V校 - 智慧教育云',
      filename: 'index.html',
      template: 'index.html',
      favicon: path.resolve(__dirname, `../static/favicon/favicon.ico`),
      inject: true, // js插入的位置
      chunks: ['app'], // 每个html引用的js模块
      chunksSortMode: 'dependency',
      multihtmlCache: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

devWebpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    title: '',
    filename: `mobile.html`,
    template: 'index.html', // 模板路径
    inject: true, // js插入的位置
    chunks: ['mobile'], // 每个html引用的js模块
    chunksSortMode: 'dependency',
    multihtmlCache: true
  })
)

// // 定制页面
// utils.getPages().forEach(p => {
//   devWebpackConfig.plugins.push(
//     new HtmlWebpackPlugin({
//       title: p.title,
//       filename: `${p.fileName}.html`,
//       template: 'index.html',
//       theme: p.theme || 'green',
//       favicon: path.resolve(__dirname, `../static/favicon/${p.favicon}`),
//       inject: true, // js插入的位置
//       hash: true,
//       chunks: [p.fileName], // 每个html引用的js模块
//       chunksSortMode: 'dependency',
//       multihtmlCache: true
//     })
//   )
// })
// 定制页面: 去掉forEach: 只打包一个入口：
// utils.getPages().forEach(p => {
const p = { fileName: 'chinamobile', title: '中移动', favicon: 'favicon.ico' }
devWebpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    title: p.title,
    filename: `${p.fileName}.html`,
    template: 'index.html',
    theme: p.theme || 'green',
    favicon: path.resolve(__dirname, `../static/favicon/${p.favicon}`),
    inject: true, // js插入的位置
    hash: true,
    chunks: [p.fileName], // 每个html引用的js模块
    chunksSortMode: 'dependency',
    multihtmlCache: true
  })
)
// })

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
          },
          onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
