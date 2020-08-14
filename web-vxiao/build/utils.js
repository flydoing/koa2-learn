'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob')

exports.assetsPath = function(_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
  options = options || {}
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass').concat({
      loader: 'sass-resources-loader',
      options: {
        resources: [path.resolve(__dirname, '../src/assets/scss/_mixin.scss'), path.resolve(__dirname, '../src/assets/scss/_color.scss')]
      }
    }),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// 多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.getEntry = globPath => {
  let entries = {},
    basename,
    tmp,
    pathname
  glob.sync(globPath).forEach(entry => {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    pathname = tmp.splice(1, 1)
    entries[pathname] = entry
  })
  return entries
}

// 多入口统一入口的配置
exports.getPages = () => {
  return [
    {
      fileName: 'ly',
      title: '乐芽 - 智慧教育云',
      favicon: 'leya_favicon.ico'
    },
    { fileName: 'gpx', title: '云知班', favicon: 'gpx_favicon.ico', theme: 'blue' },
    { fileName: 'hh', title: '华发智慧校园', favicon: 'tshf_favicon.ico' },
    { fileName: 'zplt', title: '中普蓝天', favicon: 'zplt_favicon.ico' },
    { fileName: 'tianhe', title: '天河区教育局', favicon: 'tianhe_favicon.ico' },
    { fileName: 'chinamobile', title: '中移智慧校园', favicon: 'chinamobile_favicon.ico', theme: 'blue-chinamobile' },
    { fileName: 'chinavxiao', title: '中移智慧校园', favicon: 'chinamobile_favicon.ico', theme: 'blue-chinamobile' }
  ]
}
