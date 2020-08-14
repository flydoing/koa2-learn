import http from '@/utils/http'
export default {
  /**
   * 考勤详情
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  loadDetailById(id) {
    return http.get(`/business/attendance/query/detail.json?msgId=${id}`)
  }
}
