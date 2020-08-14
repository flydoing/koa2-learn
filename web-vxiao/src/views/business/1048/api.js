import http from '@/utils/http'

export default {
  /**
   * 加载自动表彰列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadAutoCommendList(groupId) {
    return http.get(`/business/commend/list/commendAuto/${groupId}`)
  },

  /**
   * 加载自动表彰颁发条件
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadConditions(groupId) {
    return http.get(`/business/commend/list/category/143/${groupId}`)
  },

  /**
   * 加载表彰背景模板
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadTemplates(groupId) {
    return http.get(`/business/commend/list/category/${groupId}`)
  },

  /**
   * 自动表彰提交
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitAutoCommend(data) {
    return http.post(`/business/commend/add/commendAuto`, { commendAuto: data })
  },

  /**
   * 存草稿
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  saveDraft(templete) {
    return http.post(`/business/message/modify/template`, templete)
  },

  /**
   * 分类型查询最新消息内容
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  referMessage(groupId) {
    return http.post(`/businesss/message/query/latest/${groupId}`)
  }
}
