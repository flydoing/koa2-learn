import mixin from './mixin'
import chinaMobileMixin from '@/modules/chinamobile/plugin/mixin'
import http from '@/utils/http'
import vueLazyload from 'vue-lazyload'
import Web from './web'
import Import from '@/views/components/upload'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import {
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Radio,
  RadioGroup,
  Switch,
  Button,
  // Table,
  // TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Tree,
  Upload,
  Progress,
  Card,
  Steps,
  Step,
  Collapse,
  CollapseItem,
  Loading,
  MessageBox,
  Message,
  Row,
  Col,
  Transfer,
  // Tabs,
  // TabPane,
  Cascader
  // Badge
} from 'element-ui'

/**
 * 全局插件
 */
export default {
  install(Vue) {
    Vue.use(Viewer, {
      defaultOptions: {
        inline: false,
        button: false,
        navbar: false,
        title: false,
        toolbar: true,
        tooltip: false,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: false,
        transition: true,
        fullscreen: false,
        keyboard: true,
        url: 'data-source'
      }
    })
    Vue.use(vueLazyload, { attempt: 1, preLoad: 1.3 })
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Switch)
    Vue.use(Button)
    Vue.use(Input)
    // Vue.use(Table)
    // Vue.use(TableColumn)
    Vue.use(DatePicker)
    Vue.use(TimeSelect)
    Vue.use(TimePicker)
    Vue.use(Popover)
    Vue.use(Tooltip)
    Vue.use(Tree)
    Vue.use(Upload)
    Vue.use(Progress)
    Vue.use(Card)
    Vue.use(Steps)
    Vue.use(Step)
    Vue.use(Transfer)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    Vue.use(Cascader)
    // Vue.use(Badge)
    // Vue.use(Tabs)
    // Vue.use(TabPane)
    Vue.use(Loading.directive)
    Vue.component(Dropdown.name, Dropdown)
    Vue.component(DropdownMenu.name, DropdownMenu)
    Vue.component(DropdownItem.name, DropdownItem)
    Vue.component(Message.name, Message)
    Vue.component(Upload.name, Upload)
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.prototype.$message = Message
    Vue.prototype.$web = Web
    Vue.prototype.$http = http
    Vue.prototype.$import = Import
    // console.log('window.dataModule src/plugin/index.js:')
    // console.log(window.dataModule)
    if (window.dataModule.indexOf('chinamobile.html') !== -1) {
      Vue.mixin(chinaMobileMixin)
      return
    }
    Vue.mixin(mixin)
  }
}
