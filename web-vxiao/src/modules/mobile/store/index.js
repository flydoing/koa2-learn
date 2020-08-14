import Vue from 'vue'
import Vuex from 'vuex'
import app1055 from '@/store/modules/app/1055'
import app1096 from '@/store/modules/app/1096'
Vue.use(Vuex)
/**
 * 基础数据
 */
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { app1055, app1096 }
})
