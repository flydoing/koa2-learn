import http from '@/utils/http'
export default {
  /**
   * 拉取关键事件总结 学生列表
   * @param {群主ID} groupId 
   */
  getSummaryStudentList(groupId) {
    return http.get(`/business/criticalEvents/summary/count.json?groupId=${groupId}`)
  },
  /**
   * 拉取总结内容
   * @param {*} groupId 
   * @param {*} userId 
   * @param {*} season 
   */
  getSummaryConten(groupId, userId, season) {
    return http.get(`/business/criticalEvents/summary/detail.json?groupId=${groupId}&userId=${userId}&season=${season}`)
  }
}
