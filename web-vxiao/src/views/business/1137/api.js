import http from '@/utils/http'
export default {
  /**
   * 加载倒计时列表
   * @param  {[type]} groupId [description]
   * @return {[type]}      [description]
   */
  loadCountdownList(groupId) {
    return http.get(`/business/countdown/list/remind/${groupId}`)
  },

  /**
   * 加载面向对象列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  loadRangeList(schoolId) {
    return http.get(`/business/countdown/list/range/${schoolId}`)
  }
}
