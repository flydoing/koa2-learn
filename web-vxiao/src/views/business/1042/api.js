import http from '@/utils/http'
export default {
  /**
   * 加载问卷数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadQuestionnaireData(msgId, userId) {
    let url = `/business/questionnaire/query/detail/${msgId}`
    if (userId) {
      url = `${url}?userId=${userId}`
    }
    return http.get(url)
  },

  /**
   * 答题结果提交
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitAnswerData(data) {
    return http.post(`/business/questionnaire/submit/answer`, data)
  },

  /**
   * 加载问题答案数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadAnswerDataByQuestionId(msgId, qId) {
    return http.get(`/business/questionnaire/query/essay/${msgId}/${qId}`)
  }

}
