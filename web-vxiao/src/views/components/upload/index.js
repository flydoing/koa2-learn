import Vue from 'vue'
import ImportAction from './Import'
ImportAction.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: _props,
    render(h) {
      return h(ImportAction, {
        props: _props
      })
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const importAction = Instance.$children[0]
  return {
    component: importAction,
    destroy(element) {
      importAction.close()
      document.body.removeChild(element)
    }
  }
}

const Import = function(options) {
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  ImportAction.newInstance(options)
}
export default Import
