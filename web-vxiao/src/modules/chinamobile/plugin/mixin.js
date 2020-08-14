import { mapGetters, mapActions, mapMutations } from 'vuex'
import Text from '@/utils/text'
import Check from '@/utils/check'
import Image from '@/constant/image'
import * as Storage from '@/utils/storage'
import Str from '@/utils/string'
import UserEnum from '@/constant/user'
export default {
  components: {
    Card: resolve => require(['@/views/components/card/Card'], resolve),
    CardSimple: resolve => require(['@/views/components/card/CardSimple'], resolve),
    CardEntry: resolve => require(['@/views/components/card/CardEntry'], resolve),
    Overlay: resolve => require(['@/modules/chinamobile/components/Overlay'], resolve),
    Scroller: resolve => require(['@/components/scroller/Index'], resolve),
    ISwitch: resolve => require(['@/components/switch/Index'], resolve),
    Item: resolve => require(['@/components/item/Index'], resolve),
    ItemList: resolve => require(['@/components/item/ItemList'], resolve),
    ItemDetail: resolve => require(['@/components/item/ItemDetail'], resolve),
    Dialogs: resolve => require(['@/components/dialog/DialogList'], resolve),
    DialogPage: resolve => require(['@/components/dialog/Dialog'], resolve),
    Pagination: resolve => require(['@/views/components/pagination/Pagination'], resolve),
    Paging: resolve => require(['@/views/components/pagination/Index'], resolve),
    ModelPage: resolve => require(['@/modules/chinamobile/components/page/Index'], resolve),
    MenuPage: resolve => require(['@/modules/chinamobile/components/page/Default'], resolve),
    Page: resolve => require(['@/modules/chinamobile/components/page/Page'], resolve),
    AppPage: resolve => require(['@/modules/chinamobile/components/page/AppPage'], resolve),
    Popover: resolve => require(['@/modules/chinamobile/components/page/Popover'], resolve),
    TextInput: resolve => require(['@/components/TextInput'], resolve),
    VxTable: resolve => require(['@/components/table/Index'], resolve),
    VxTableColumn: resolve => require(['@/components/table/column'], resolve)
  },
  data() {
    return {
      openPage: false
    }
  },
  computed: {
    ...mapGetters({
      innerWidth: 'innerWidth',
      innerHeight: 'innerHeight',
      USER: 'getSigninUser',
      baseInfo: 'getBaseInfo',
      showPage: 'showPage',
      getHandldeBack: 'getHandldeBack'
    }),
    Image() {
      return Image
    },
    w() {
      return this.innerWidth
    },
    h() {
      return this.innerHeight
    },
    tblPageWidth() {
      return (this.innerWidth * 2) / 3
    },
    uploadURL() {
      return `/commons/file/upload`
    }
  },
  created() {},
  methods: {
    ...mapActions({ offPage: 'showPage' }),
    ...mapMutations(['clearHandleBack']),
    commonMessage() {
      return {
        fromUserId: this.baseInfo.USERID,
        fromClientId: this.baseInfo.CLIENTID,
        fromUserAvatar: this.USER.avatar,
        fromUserName: this.USER.name,
        refId: Str.uuid(),
        status: 1
      }
    },
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
      if (!this.showPage) {
        this.offPage(true)
      }
      this.$router.push(path)
    },
    routePushModel(path) {
      this.routePush(path)
    },
    /**
     * replace路由
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    routeReplace(path) {
      this.$router.replace(path)
    },
    /**
     * 返回
     * @return {[type]} [description]
     */
    routeBack(index = -1) {
      if (this.getHandldeBack === 'twice' && this.$route.path.indexOf('create/default') !== -1) {
        this.$router.go(-2)
        this.clearHandleBack()
      } else {
        this.$router.go(index)
      }
    },
    /**
     * 根据文件id获取图片地址
     * @param  {[type]} fileId [description]
     * @param  {String} thumb  [description]
     * @return {[type]}        [description]
     */
    url(fileId, thumb = '') {
      if (!fileId) {
        return ''
      }
      return `${window.location.protocol}${this.$store.state.FILE_URL}/${fileId}?${thumb}`
      // return `${window.location.protocol}//${window.location.host}/commons/file/${fileId}?${thumb}`
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
    imageStyle() {
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
    labelRole(type) {
      return UserEnum.keyCode(type)
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
    removeStorage(key) {
      return Storage.session.removeLike(key)
    },
    /**
     * 返回上一路由页面的缓存数据
     * @return {[type]} [description]
     */
    callbackState() {},
    leaveRoute(to, from, next) {
      return true
    },
    openBrowser(url = '') {
      if (url.indexOf('http') < 0) {
        url = `${this.baseInfo.BUSINESS_URL}${url}`
      }
      window.open(url)
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
    if (to.path === '/vx/' || to.path === '/vx') {
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
