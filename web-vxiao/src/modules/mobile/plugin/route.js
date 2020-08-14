export default {
  name: 'r',
  history: [], // 历史记录 
  _push(path, $route) {
    $route.push(path, r => {
      this.history.push(r.fullPath)
    })
  },
  _replace(path, $route) {
    $route.replace(path, r => {
      this.history.pop()
      this.history.push(r.fullPath)
    })
  },
  _isIndex(fullPath) {
    return !this.history.includes(fullPath)
  }
}
