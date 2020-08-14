import mixin from './mixin'
import http from '@/utils/http'
import vueLazyload from 'vue-lazyload'
import VueJsonp from 'vue-jsonp'
import Web from './web'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import '@/assets/scss/element.scss'
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Radio,
  RadioGroup,
  Switch,
  Button,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Upload,
  Progress,
  Card,
  Steps,
  Step,
  Collapse,
  CollapseItem,
  Loading,
  MessageBox,
  Message
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
    Vue.use(VueJsonp)
    Vue.use(vueLazyload, { attempt: 1, preLoad: 1.3 })
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Switch)
    Vue.use(Button)
    // Vue.use(Table)
    // Vue.use(TableColumn)
    Vue.use(DatePicker)
    Vue.use(TimeSelect)
    Vue.use(TimePicker)
    Vue.use(Popover)
    Vue.use(Tooltip)
    Vue.use(Upload)
    Vue.use(Progress)
    Vue.use(Card)
    Vue.use(Steps)
    Vue.use(Step)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    Vue.use(Loading.directive)
    Vue.component(Dropdown.name, Dropdown)
    Vue.component(DropdownMenu.name, DropdownMenu)
    Vue.component(DropdownItem.name, DropdownItem)
    Vue.component(Message.name, Message)
    Vue.component(Upload.name, Upload)
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$message = Message
    Vue.prototype.$web = Web
    Vue.prototype.$http = http
    Vue.mixin(mixin)
  }
}
