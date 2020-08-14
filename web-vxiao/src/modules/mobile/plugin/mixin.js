import Text from '@/utils/text'
import Check from '@/utils/check'
import Image from '@/constant/image'
import R from './route'
import * as Storage from '@/utils/storage'
export default {
  components: {
    Scroller: resolve => require(['@/components/scroller/Index'], resolve),
    ISwitch: resolve => require(['@/components/switch/Index'], resolve),
    Item: resolve => require(['@/components/item/Index'], resolve),
    ItemList: resolve => require(['@/components/item/ItemList'], resolve),
    Pagination: resolve => require(['@/views/components/pagination/Pagination'], resolve),
    Paging: resolve => require(['@/views/components/pagination/Index'], resolve),
    Page: resolve => require(['@/views/components/page/Page'], resolve),
    VxTable: resolve => require(['@/components/table/Index'], resolve),
    VxTableColumn: resolve => require(['@/components/table/column'], resolve),
    TextInput: resolve => require(['@/components/TextInput'], resolve)
  },
  data() {
    return {
      openPage: false
    }
  },
  computed: {
    Image() {
      return Image
    },
    w() {
      return `${window.innerWidth}px`
    },
    h() {
      return `${window.innerHeight}px`
    },
    innerHeight() {
      return this.$route.path.indexOf('pages') > 0 ? window.innerHeight : window.innerHeight - 40
    },
    uploadURL() {
      return `/commons/file/upload`
    }
  },
  created() {},
  methods: {
    /**
     * 获取路由上的查询参数
     * @param  {[type]} field [description]
     * @return {[type]}       [description]
     */
    routeParam(field) {
      return this.$route.params[field]
    },
    routeQuery(field) {
      return this.$route.query[field]
    },
    /**
     * push路由
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    routePush(path) {
      R._push(path, this.$router)
    },
    /**
     * replace路由
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    routeReplace(path) {
      R._replace(path, this.$router)
    },

    /**
     * 相同的路由，且需要替换的情况下
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    routeRepeat(path) {
      this.$route.name === path.name ? this.routeReplace(path) : this.routePush(path)
    },
    /**
     * 返回
     * @return {[type]} [description]
     */
    routeBack() {
      this.$router.go(-1)
    },
    /**
     * 验证是否首页
     * @return {[type]} [description]
     */
    routeIndex() {
      return R._isIndex(this.$route.fullPath)
    },
    /**
     * 根据文件id获取图片地址
     * @param  {[type]} fileId [description]
     * @param  {String} thumb  [description]
     * @return {[type]}        [description]
     */
    url(fileId, thumb = '') {
      // return `${this.$store.state.FILE_URL}${fileId}?${thumb}`
      if (!fileId) {
        return ''
      }
      return `${window.location.protocol}//${window.location.host}/commons/file/${fileId}?${thumb}`
    },
    converContent(content) {
      if (content) {
        content = Text.changeUrl(content)
        content = Text.changeFlag(content)
        content = Text.changeTopic(content)
        content = Text.changeAnd(content)
        content = Text.changeEmotions(content)
        content = Text.changeTxtImage(content)
        return content
      }
      return ''
    },
    imageStyle: function() {
      return {
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center'
      }
    },
    /**
     * 验证某个字段是否存在
     * @param  {[type]} field [description]
     * @return {[type]}       [description]
     */
    checkNull(field) {
      return Check.isNull(field)
    },
    labelSex(sex) {
      return sex === '1' ? '男' : '女'
    },
    getStorage(key, cache = false) {
      return Storage.session.get(key, cache)
    },
    setStorage(key, value) {
      Storage.session.set(key, JSON.stringify(value))
    },
    /**
     * 返回上一路由页面的缓存数据
     * @return {[type]} [description]
     */
    callbackState() {},
    /**
     * 用于web弹窗的时候注册事件
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    loadPage(page) {
      this.$emit('loadPage', page)
    },
    leaveRoute(to, from, next) {
      return true
    }
  },
  filters: {
    arrayToString(arr) {
      if (!Check.isRealArray(arr)) {
        return ''
      }
      return arr.join('、')
    },
    arrayNameToString(datas) {
      let arr = []
      if (datas) {
        datas.forEach(d => {
          arr.push(d.name)
        })
      }
      return arr.join('、')
    }
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    if (to.path === '/vx/group' || to.path === '/vx') {
      this.offPage(false)
    }
    next(this.leaveRoute(to, from, next))
  },
  watch: {
    $route(to, from) {
      this.callbackState(to, from)
    }
  }
}
