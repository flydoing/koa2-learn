import Vue from 'vue'
import App from './App'
import router from './route'
import store from './store'
import Plugins from './plugin'
import '@/assets/scss/element.scss'
Vue.use(Plugins)
Vue.config.devtools = true
Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
