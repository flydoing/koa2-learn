import http from '@/utils/http'
export default {
  /**
   * 加载历史列表
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  loadOrderReport(groupId) {
    return http.get(`/business/workorder/statistics/detail.json?groupId=${groupId}`)
  },

  /**
   * 加载默认负责人
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getDefaultHandlers(groupId) {
    return http.get(`/business/workorder/treatDetails.json?groupId=${groupId}`)
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
