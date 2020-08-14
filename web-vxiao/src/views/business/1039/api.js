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
   * 编辑默认负责人
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyHandler(data) {
    return http.post(`/business/workorder/add/audit`, data)
  }
}
