import Vue from 'vue'
import App from './App'
import router from '@/route/pages'
import Plugins from './plugin'
import store from '@/modules/mobile/store'
import Check from '@/utils/check'
import Web from '@/plugin/web'

Vue.use(Plugins)
Vue.config.devtools = true
Vue.config.productionTip = false

let vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  data() {}
})
vm.$mount('#app')

/**
 * 绑定监听回调（客户端回调）
 * @type {Object}
 */
window.wc = {
  postAction(json) {
    return window.wc.jsAction(json)
  },
  jsAction(json = '{}') {
    try {
      json = JSON.parse(json)
      // 默认是返回
      if (Check.isNullObject(json)) {
        // 如果是首页，则返回
        if (vm.routeIndex()) {
          return JSON.stringify({
            type: 'exit'
          })
        }
        vm.$router.back()
        return JSON.stringify({})
      }
      if (json.type === 'back') {
        vm.$router.go(json.content)
      } else {
        Web.events[json.type](json)
      }
    } catch (e) {
      console.error(`[Error Message]：${e.message};[Data]：${json}`)
      // Message.error({ content: '[Error Message]:' + e.message })
    }
  }
}
