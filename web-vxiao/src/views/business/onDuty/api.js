import http from '@/utils/http'

export default {
  /**
   * 加载值日生列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getOnDutyUsers(groupId) {
    return http.get(`/business/duty/days/query/?groupId=${groupId}`)
  },

  /**
   * 编辑值日生
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  modifyOnDutyUsers(data) {
    return http.post('/business/duty/days/add', data)
  },

  /**
   * 获取设置metaData
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getOnDutyMetaDatas(groupId) {
    return http.get(`/business/duty/metaData/query?groupId=${groupId}`)
  }
}
