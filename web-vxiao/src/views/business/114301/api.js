import http from '@/utils/http'
export default {
  /**
   * 加载放学详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadLeaveSchoolDetail(msgId) {
    return http.get(`/business/leaveschool/getLeaveSchoolDetail/${msgId}`)
  }
}
