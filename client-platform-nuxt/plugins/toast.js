import Vue from 'vue'
import Toast from '../components/base/toast/toast.vue'
// import BlRegion from '~components/frame/region/Region.vue'
// import BlLayout from '~components/frame/layout/Layout.vue'
// import BlGrid from '~components/frame/grid/Grid.vue'
// import BlColumn from '~components/frame/column/Column.vue'

const components = { Toast }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
