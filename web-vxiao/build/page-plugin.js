function PagePlugin(paths = []) {
  this.paths = paths
}
PagePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (data, cb) => {
      let l = this.paths.length
      while (l--) {
        data.assets.js.unshift(this.paths[l])
      }
      cb(null, data)
    })
  })
}
module.exports = PagePlugin
