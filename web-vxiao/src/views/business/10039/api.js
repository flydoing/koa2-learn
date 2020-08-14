import http from '@/utils/http'
export default {
  /**
   * 获取表模模板
   * @return {[type]}         [description]
   */
  getTemplate() {
    return http.get('/business/finance/get/all/template/10039')
  },

  /**
   * 查询填报状态
   * @param  schoolId
   * @return {[type]}         [description]
   */
  queryStatus(schoolId) {
    return http.get(`/business/finance/get/template/10039?schoolId=${schoolId}`)
  },

  /**
   * 获取教育局报表
   * @param  schoolId
   * @return {[type]}         [description]
   */
  getEducationReport(schoolId, templateId) {
    return http.get(`/business/finance/get/education/table?schoolId=${schoolId}&templateId=${templateId}`)
  },

  /**
   * 导入excel数据
   * @return {[type]}         [description]
   */
  importData(params) {
    return http.post('/business/finance/import/data', params)
  },

  /**
   * 设置表模时间
   * @param  templateId
   * @param  startDate
   * @param  endDate
   * @return {[type]}         [description]
   */
  setTemplateTime(params) {
    return http.post('/business/finance/set/template/date', params)
  },

  /**
   * 查看模板详情
   * @param  templateId
   * @param  schoolId
   * @return {[type]}         [description]
   */
  getTemplateDetail(schoolId, templateId) {
    return http.get(`/business/finance/get/template/detail?schoolId=${schoolId}&templateId=${templateId}`)
  },

  /**
   * 保存或更新模板数据
   * @param  templateId
   * @param  schoolId
   * @param data (填写数据JSON字符串)
   * @return {[type]}         [description]
   */
  saveFormData(param) {
    return http.post(`/business/finance/data/save`, param)
  }
}
