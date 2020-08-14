import http from '@/utils/http'
export default {
  /**
   * 加载考勤详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadAttendanceDetail(msgId, groupId, userId) {
    return http.get(`/report/business/1197/${groupId}?msgId=${msgId}&groupId=${groupId}&noTempletReport=1&fromUserId=${userId}`)
  }
}
