import http from '@/utils/http'
export default {
  /**
   * 获取评分模板
   * @param {templateId} tId 
   */
  getCommentItem(tId) {
    return http.get(`/business/course/query/template/${tId}`)
  },
  /**
   * 获取评课详情
   * @param {子消息ID} msgId 
   */
  getCommentDetail(msgId) {
    return http.get(`/business/course/query/rating/${msgId}`)
  }
}
