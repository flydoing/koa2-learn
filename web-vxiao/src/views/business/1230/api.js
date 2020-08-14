import http from '@/utils/http'

export default {

  /**
   * 加载模板详情
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadTemplateDetail(groupId, subjectId, gradeType) {
    return http.get(`/business/subjectevaluation/list/model/${groupId}?remark=${subjectId}&&extension=${gradeType}`)
  },

  /**
   * 提交分类
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitCategory(data) {
    return http.post(`/business/subjectevaluation/add/category`, { category: data })
  },

  /**
   * 加载学生列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadStudentList(groupId) {
    return http.get(`/business/subjectevaluation/list/student/${groupId}`)
  },

  /**
   * 加载老师任教科目
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadUserSubjects(groupId) {
    return http.get(`/business/subjectevaluation/user/subject/${groupId}`)
  },

  /**
   * 加载科目知识图谱
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadSubjectKnowledges(groupId, subjectId) {
    return http.get(`/business/subjectevaluation/list/item/${groupId}?remark=${subjectId}`)
  }

}
