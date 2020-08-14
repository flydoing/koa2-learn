import http from '@/utils/http'
export default {
  /**
   * 获取模板列表
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  getTemplates(schoolId) {
    return http.get(`/business/homevisit/list/templet/${schoolId}`)
  },

  /**
   * 获取模板列表
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  saveTemplate(data) {
    return http.post(`/business/homevisit/add/templet`, { templet: data })
  },

  /**
   * 获取模板列表
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  getFeedbackRecords(msgId) {
    return http.get(`/business/homevisit/query/detail/${msgId}`)
  },

  /**
   * 获取问卷列表
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  getQuestions(schoolId) {
    return http.get(`/business/homevisit/list/question/${schoolId}`)
  },

  /**
   * 修改问卷
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  modifyQuestion(data) {
    return http.post('/business/homevisit/modify/questionList', data)
  },

  /**
   * 获取定位数据
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  getAddressLocation(msgId, questionId, userId) {
    let url = `/business/questionnaire/queryMap/detail/${msgId}/${questionId}`
    if (userId) {
      url = `${url}?userId=${userId}`
    }
    return http.get(url)
  },
  /**
   * 【问卷】词云数据
   * @param  {[type]} questionid [description]
   * @return {[type]}      [description]
   */
  getWordcloud(questionid) {
    return http.get(`/business/questionnaire/wordcloud/${questionid}`)
  }
}
