import http from '@/utils/http'
export default {
  /**
   * 导入工资单
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  importPayrollData(data) {
    return http.post(`/business/wages/import`, { wages: data })
  }
}
