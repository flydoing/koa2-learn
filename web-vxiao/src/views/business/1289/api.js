import http from '@/utils/http'
export default {
  /**
   * 新建行事历
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  addCalendar(message) {
    return http.post('/business/message/add.json', { message })
  },

  /**
   * 进展反馈
   * @param  {[type]} params [description]
   * @return {[type]}         [description]
   */
  progressFeedBack(messageId, replys) {
    return http.post(`/business/message/update.json`, { message: { id: messageId, replys: [replys] } })
  }
}
