import http from '@/utils/http'

export default {
  saveConfig(state, { auth, account }) {
    const protocol = auth.businessServer.protocol ? auth.businessServer.protocol.toLocaleLowerCase() : 'http'
    const ws = window.location.protocol.indexOf('https') >= 0 ? 'wss' : 'ws'
    state.PROTOCAL = protocol
    state.USERID = auth.userInfo.id
    state.TOKENID = auth.tokenId
    state.ACCOUNT = account
    state.CLIENTID = `web${auth.userInfo.id}`
    state.FILE_URL = `//${auth.fileServer.uri}`
    state.BUSINESS_URL = `//${auth.businessServer.uri}`
    state.WS_URL = `${ws}://${auth.websocketServer.uri}`
    state.UPLOAD_URL = `/commons/file/upload`
    if (process.env.NODE_ENV === 'production') {
      // http.defaults.baseURL = state.BUSINESS_URL
    }
    // 设置请求头
    http.defaults.headers.common['tokenId'] = state.TOKENID
    http.defaults.headers.common['ClientId'] = state.CLIENTID
  },

  saveSigninStatus(state, status) {
    state.logined = status
  },
  /**
   * 设置模态弹窗页面
   * @param  {[type]} state  [description]
   * @param  {[type]} status [description]
   * @return {[type]}        [description]
   */
  showPage(state, status) {
    state.showPage = status
  },

  /**
   * 窗口变化
   * @Author   clz
   * @DateTime 2018-10-10
   * @param    {[type]}   state [description]
   * @param    {[type]}   r     [description]
   * @return   {[type]}         [description]
   */
  resize(state, r) {
    state.resize = r
  },

  /**
   * 全局搜索
   * @Author   clz
   * @DateTime 2018-11-05
   * @param    {[type]}   state  [description]
   * @param    {[type]}   search [description]
   * @return   {[type]}          [description]
   */
  globalSearch(state, search) {
    state.globalSearch = search
  },

  /**
   * 群关于开关
   * @Author   clz
   * @DateTime 2018-11-10
   * @param    {[type]}   state  [description]
   * @param    {[type]}   status [description]
   * @return   {[type]}          [description]
   */
  saveGroupInfo(state, status = true) {
    state.showGroupContacts = status
  },

  /**
   * 菜单类型
   * @Author   zcy
   * @DateTime 2019-08-08
   * @param    {[type]}   state  [description]
   * @param    {[type]}   value [description]
   * @return   {[type]}          [description]
   */
  saveMenuType(state, value = '1') {
    state.menuType = value
  },

  /**
   * 弹页是否需要提示关闭
   * @Author   clz
   * @DateTime 2018-11-10
   * @param    {[type]}   state  [description]
   * @param    {[type]}   status [description]
   * @return   {[type]}          [description]
   */
  modifyClosingPrompt(state, status = false) {
    state.closingPrompt = status
  }
}
