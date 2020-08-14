'use strict'
const path = require('path')
const merge = require('webpack-merge')

let proxy = { target: 'https://m.ipipa.cn', changeOrigin: true, pathRewrite: { '^/rest': '/rest' } }
// let proxy = { target: 'http://m.vxiao.cn', changeOrigin: true, pathRewrite: { '^/rest': '/rest' } }
// let proxy = { target: 'http://192.168.3.168:81', changeOrigin: true, pathRewrite: { '^/rest': '/rest' } }
// let proxy = { target: 'http://192.168.3.149', changeOrigin: true, pathRewrite: { '^/rest': '/rest' } }
// let proxy = { target: 'http://192.168.3.171:8989', changeOrigin: true, pathRewrite: { '^/rest': '/rest' } }

module.exports = {
  dev: {
    cdns: [
      '/static/vender/vue.2.5.2.js?@2.5.2',
      '/static/vender/vuex.min.js',
      '/static/vender/vue-router.min.js',
      '/static/vender/axios.min.js',
      '/static/vender/vue-lazyload.js',
      '/static/vender/element.min.js',
      '/static/vender/polyfill.min.js'
    ],
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host: 'localhost', // can be overwritten by process.env.HOST~~
    host: '192.168.3.43', // can be overwritten by process.env.HOST~~
    port: 88, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'eval',
    // devtool: '#source-map', // 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: false,
    useEslint: true,
    sourcemap: false,
    proxyTable: {
      '/rest': proxy,
      '/base': merge(proxy, {
        pathRewrite: {
          '^/base': '/base'
        }
      }),
      '/commons': merge(proxy, {
        pathRewrite: {
          '^/commons': '/commons'
        }
      }),
      '/im': merge(proxy, {
        pathRewrite: {
          '^/im': '/im'
        }
      }),
      '/report': merge(proxy, {
        pathRewrite: {
          '^/report': '/report'
        }
      }),
      '/business': merge(proxy, {
        pathRewrite: {
          '^/business': '/business'
        }
      }),
      '/lishui': merge(proxy, {
        pathRewrite: {
          '^/lishui': '/lishui'
        }
      }),
      '/terminal': merge(proxy, {
        pathRewrite: {
          '^/terminal': '/terminal'
        }
      }),
      '/v1/cloud': merge(proxy, {
        pathRewrite: {
          '^/v1/cloud': '/v1/cloud'
        }
      }),
      '/papers': merge(proxy, {
        pathRewrite: {
          '^/papers': '/papers'
        }
      }),
      '/ajax': merge(proxy, {
        target: 'http://xlb.ipipa.cn',
        pathRewrite: {
          '^/ajax': '/ajax'
        }
      })
    }
  },
  build: {
    cdns: [
      '/static/vender/vue.min.2.5.2.js?@2.5.2',
      '/static/vender/vuex.min.js',
      '/static/vender/vue-router.min.js',
      '/static/vender/axios.min.js',
      '/static/vender/vue-lazyload.js',
      // '/static/vender/element.min.js',
      '/static/vender/polyfill.min.js'
    ],
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: false // process.env.npm_config_report
  }
}
