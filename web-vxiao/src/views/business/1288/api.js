import http from '@/utils/http'
export default {
  /**
   * 绑定北电项目
   * @param  {[type]} schoolId [description] 学校ID
   * @param  {[type]} projCode [description] 项目编号
   * @return {[type]}         [description]
   */
  bindingProject(schoolId, projCode) {
    return http.post('/business/meter/bind/project', { schoolId, projCode })
  },

  /**
   * 获取已经绑定的项目
   * @param  {[type]} schoolId [description] 学校ID
   * @return {[type]}         [description]
   */
  getBindingProject(schoolId) {
    return http.get(`/business/meter/query/project`, { params: { schoolId } })
  },

  /**
   * 获取报表详情
   * @param  {[type]} schoolId [description] 学校ID
   * @return {[type]}         [description]
   */
  getReportDetail(apptype, groupid, noTempletReport, date, meterType) {
    return http.get(`/report/business/${apptype}/${groupid}`, { params: { noTempletReport: noTempletReport, date: date, meterType: meterType } })
  }
}
