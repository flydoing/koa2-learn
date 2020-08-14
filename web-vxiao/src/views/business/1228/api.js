import http from '@/utils/http'
export default {
  /**
   * 获取周期设置列表
   * @param  {[type]} groupId [description]
   * @return {[type]}      [description]
   */
  getPeriodices(groupId) {
    return http.get(`/business/broadcast/group/list?groupId=${groupId}`)
  },

  /**
   * 获取场所列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  getPlaces(schoolId) {
    return http.get(`/business/broadcast/list/places/${schoolId}`)
  },

  /**
   * 新增周期广播
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  addPeriodic(data) {
    return http.post(`/business/broadcast/add`, data)
  },

  /**
   * 修改周期广播
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  modifyPeriodic(data) {
    return http.post(`/business/broadcast/modify`, data)
  },

  /**
   * 删除周期广播
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  removePeriodic(data) {
    return http.post(`/business/broadcast/delete`, data)
  }
}
