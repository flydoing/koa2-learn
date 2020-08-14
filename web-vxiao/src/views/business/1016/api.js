import http from '@/utils/http'
export default {
  /**
   * 加载栏目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getColumns(groupId) {
    return http.get(`/business/portal/category/query/all/${groupId}?type=portal_menu`)
  },

  /**
   * 提交栏目
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitColumn(data) {
    return http.post('/business/portal/category/save', { components: data })
  },

  /**
   * 提交焦点图
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitBanner(data) {
    return http.post('/rest/portal/banner/add', data)
  },

  /**
   * 加载焦点图列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getBanners(groupId) {
    return http.get(`/rest/portal/banner/${groupId}`)
  },

  /**
   * 删除焦点图
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  removeBanner(data) {
    return http.post('/rest/portal/banner/del', data)
  },

  /**
   * 加载微信账号
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getWechatAccount(groupId) {
    return http.get(`/rest/portal/getWeixinAccount/${groupId}`)
  },

  /**
   * 提交微信账号
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitWechatAccount(data) {
    return http.post('/rest/portal/saveWeixinAccount', { weiXinInfo: data })
  },

  /**
   * 加载微信菜单列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getWechatMenus(groupId) {
    return http.get(`/rest/portal/getWexinSyncMenu/${groupId}`)
  },

  /**
   * 加载微信二级菜单列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getWechatSubMenus(groupId) {
    return http.get(`/business/portal/category/second/all/${groupId}`)
  },

  /**
   * 提交微信菜单
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitWechatMenu(groupId, data) {
    return http.post(`/rest/portal/saveWeixinSyncMenu/${groupId}`, { weiXinMenu: data })
  },

  /**
   * 加载二级栏目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getSecondColumns(groupId) {
    return http.get(`/business/portal/category/second/me/${groupId}`)
  }
}
