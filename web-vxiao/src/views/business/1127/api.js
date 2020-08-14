import http from '@/utils/http'
export default {
  /**
   * 加载课程评价分类
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getCatgeories(schoolId) {
    return http.get(`/business/courseevaluation/list/settings/${schoolId}`)
  },

  /**
   * 提交课程评价分类
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitCategory(data) {
    return http.post(`/business/courseevaluation/add/item`, { item: data })
  },

  /**
   * 加载评价科目及周期设置数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getSubjectSetting(schoolId) {
    return http.get(` /business/courseevaluation/list/subject/sets/${schoolId}`)
  },

  /**
   * 提交学生及家长可评价结果设置
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitSubjectSetting(data) {
    return http.post(`/business/courseevaluation/add/subject/setting`, { sets: data })
  },

  /**
   * 提交学生及家长可评价结果设置
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitResultSets(data) {
    return http.post(`/rest/courseevaluation/sets/modify`, { sets: data })
  },

  /**
   * 提交表单
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitForm(groupId, data) {
    return http.post(`/business/approve/add/from?groupId=${groupId}`, { approveFroms: [data] })
  },

  /**
   * 提交表单
   * @param  {[type]} userId [description]
   * @param  {[type]} evId [description]
   * @return {[type]}    [description]
   */
  getStudents(userId, evId) {
    return http.get(`/rest/courseevaluation/joinDetail.json?userId=${userId}&${evId}`)
  }
}
