import http from '@/utils/http'
export default {
  /**
   * 获取年级列表
   * @param  {[type]} groupId [description]
   * @return {[type]}      [description]
   */
  getGrades(schoolId) {
    return http.get(`/rest/group/list/grades?schoolId=${schoolId}&tree=1`)
  },

  /**
   * 获取科目列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  getSubjects(schoolId) {
    return http.get(`/business/schoolSubject/table?schoolId=${schoolId}&type=option`)
  },

  /**
   * 获取联考列表
   * @param  {[type]} groupId [description]
   * @return {[type]}      [description]
   */
  getExams(groupId) {
    return http.get(`/business/entranceexam/list?groupId=${groupId}`)
  },

  /**
   * 获取选课信息
   * @param  {[type]} projectId [description]
   * @param  {[type]} userId [description]
   * @return {[type]}      [description]
   */
  getSelectionInfo(projectId, userId) {
    return http.get(`/business/selectcourse/publish/detail?projectId=${projectId}&userId=${userId}`)
  },

  /**
   * 获取已选课学生列表
   * @param  {[type]} projectId [description]
   * @param  {[type]} key [description]
   * @return {[type]}      [description]
   */
  getSelectedStudents(projectId, key, type) {
    return http.get(`/business/selectcourse/selected/students?projectId=${projectId}&key=${key}&type=${type}`)
  },
  /**
   * 获取未选课学生列表
   * @param  {[type]} projectId [description]
   * @return {[type]}      [description]
   */
  getUnselectedStudents(projectId) {
    return http.get(`/business/selectcourse/unselect/students?projectId=${projectId}`)
  },

  /**
   * 获取专业列表
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  getMajors(data) {
    return http.post(`/business/selectcourse/major/lists`, data)
  },

  /**
   * 获取省份列表
   * @return {[type]}      [description]
   */
  getProvinces() {
    return http.get(`/business/selectcourse/major/areas`)
  },

  /**
   * 获取批次列表
   * @return {[type]}      [description]
   */
  getLevels() {
    return http.get(`/business/selectcourse/major/levels`)
  },

  /**
   * 提交选课
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  commitSelection(data) {
    return http.post(`/business/selectcourse/commit`, data)
  }
}
