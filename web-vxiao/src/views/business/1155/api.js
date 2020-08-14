import http from '@/utils/http'
export default {
  /**
   * 获取体检项目
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getProjects(groupId) {
    return http.get(`/business/health/list/project/${groupId}`)
  },

  /**
   * 提交体检项目
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  commitProjects(datas) {
    return http.post(`/business/health/add/project`, { projects: datas })
  },

  /**
   * 导入体检报告
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  importReportData(schoolId, data) {
    return http.post(`/business/health/import/health/V2`, data)
  }

}
