import http from '@/utils/http'
export default {
  /**
   * 加载评估对象数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadObjectsData(msgId, userId) {
    return http.get(`/business/teacherappraisal/appraise/query/${msgId}?userId=${userId}`)
  },

  /**
   * 加载校级详情统计数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadSummaryDetailData(apslId, userId) {
    return http.get(`/business/teacherappraisal/history/target/detail?appraisalId=${apslId}&userId=${userId}`)
  },

  /**
   * 加载校级评估对象数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadSummaryObjectsData(msgId, userId) {
    return http.get(`/business/teacherappraisal/query/result/${msgId}?userId=${userId}`)
  },

  /**
   * 提交评估结果
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitTeacherApslResult(data) {
    return http.post(`/business/teacherappraisal/appraise/add`, data)
  },

  /**
   * 加载答案结果数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadAnswerResultData(groupId, qId, apslId, userId) {
    return http.get(`/report/business/1178/${groupId}?extension=questionDetail&questionId=${qId}&appraisalId=${apslId}&userId=${userId}`)
  },

  /**
   * 加载评估方案列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadCaseList(groupId) {
    return http.get(`/business/teacherappraisal/project/group/${groupId}`)
  },

  /**
   * 提交评估方案
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitCase(data) {
    return http.post(`/business/teacherappraisal/project/add`, { project: data })
  },

  /**
   * 删除评估方案
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  removeCase(caseId) {
    return http.get(`/business/teacherappraisal/project/delete/${caseId}`)
  },

  /**
   * 提交教师评估
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitTeacherApsl(data) {
    return http.post(`/business/teacherappraisal/create`, { appraisal: data })
  },

  /**
   * 加载评估方案列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getChildrenAuth(msgId) {
    return http.get(`/business/teacherappraisal/list/childs/${msgId}`)
  }
}
