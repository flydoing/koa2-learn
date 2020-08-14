import http from '@/utils/http'

export default {
  /**
   * 加载签到签退记录列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSigns(groupId, appType) {
    return http.get(`/business/attendance/crm/visit/datas?groupId=${groupId}&crmAppType=${appType}`)
  },
  /**
   * 加载客户活跃率
   * @param  {[type]} id [description]
   * @return {[type]}         [description]
   */
  getCustomerActive(id) {
    return http.get(`/rest/statistics/queryUserActivePercent/${id}`)
  }
}
