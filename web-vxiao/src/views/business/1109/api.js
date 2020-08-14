import http from '@/utils/http'
export default {
  /**
   * 加载报销汇总详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadExpenseSummaryDetail(groupId, userId, type) {
    return http.get(`/report/business/1109/${groupId}?extension=${type}&fromUserId=${userId}`)
  },

  /**
   * 获取当前用户的审批权限
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getExpenseUserAuth(groupId, userId, startDate, endDate, fromUserId) {
    return http.get(`/business/wiped/approveAuth?userId=${userId}&startDate=${startDate}&endDate=${endDate}&groupId=${groupId}&fromUserId=${fromUserId}`)
  },

  /**
   * 获取当前用户的审批权限
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getUserExpenseSummary(groupId, userId, startDate, endDate, fromUserId) {
    return http.get(`/business/wiped/user/pool?userId=${userId}&startDate=${startDate}&endDate=${endDate}&groupId=${groupId}&fromUserId=${fromUserId}`)
  },

  /**
   * 获取处理人
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getExpenseHandlers(groupId) {
    return http.get(`/rest/metadata/list?groupId=${groupId}&metaTypes=m_wiped_approve_person,m_wiped_executor_person`)
  }
}
