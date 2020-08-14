import http from '@/utils/http'
export default {
  /**
   * 获取项目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getProjects(groupId) {
    return http.get(`/business/physical/list/item/${groupId}`)
  },

  /**
   * 获取学校年级列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSchoolGrades(schoolId) {
    return http.get(`/rest/group/list/grades?schoolId=${schoolId}&tree=1`)
  },

  /**
   * 导入体测成绩
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  importGradesData(schoolId, data) {
    return http.post(`/business/physical/import/data/V2`, data)
  }
}
