import http from '@/utils/http'
export default {
  /**
   * 加载总结对象数据
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  loadObjectsData(msgId) {
    return http.get(`/business/summary/list/detail/${msgId}`)
  },

  /**
   * 提交评价总结
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  commitSummaryData(data) {
    return http.post('/business/summary/add', { detail: data })
  },

  /**
   * 加载面向对象列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  loadRangeList(schoolId) {
    return http.get(`/business/summary/list/range/${schoolId}`)
  },

  /**
   * 导入总结数据
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  importSummaryData(data) {
    return http.post(`/business/summary/import/data`, data)
  },

  /**
   * 导入总结数据
   * @param  {[type]} groupId [description]
   * @param  {[type]} userId [description]
   * @return {[type]}      [description]
   */
  getComments(groupId, userId) {
    return http.get(`/business/summary/list/comment/${groupId}/${userId}`)
  }
}
