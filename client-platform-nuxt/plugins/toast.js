import Vue from 'vue'
import Toast from '../components/base/toast1/toast.vue'
import Toast222 from '../components/base/toast/toast.js'
// import BlRegion from '~components/frame/region/Region.vue'
// import BlLayout from '~components/frame/layout/Layout.vue'
// import BlGrid from '~components/frame/grid/Grid.vue'
// import BlColumn from '~components/frame/column/Column.vue'

Vue.use(Toast222)
const components = { Toast }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
