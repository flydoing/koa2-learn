import Vue from 'vue'
import { Toast } from 'vant'
// 目前在 nuxt 中无法按需引入样式，因此采用手动引入的方式
import 'vant/lib/index.css'
// import BlRegion from '~components/frame/region/Region.vue'
// import BlLayout from '~components/frame/layout/Layout.vue'
// import BlGrid from '~components/frame/grid/Grid.vue'
// import BlColumn from '~components/frame/column/Column.vue'

Vue.use(Toast)
Vue.prototype.$toastvant = Toast

// const components = { Toast }

// Object.entries(components).forEach(([name, component]) => {
//   Vue.component(name, component)
// })
