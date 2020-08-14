import http from '@/utils/http'
export default {
  /**
   * 加载巡检地点列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}         [description]
   */
  loadPlaceList(schoolId) {
    return http.get(`/business/inspection/list/places/${schoolId}`)
  },

  /**
   * 提交巡检地点
   * @param  {[type]} datas [description]
   * @return {[type]}         [description]
   */
  commitPlaces(datas) {
    return http.post(`/business/inspection/add/place`, { places: datas })
  },

  /**
   * 加载巡检项目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadProjectList(groupId) {
    return http.get(`/business/inspection/list/item/${groupId}`)
  },

  /**
   * 提交巡检项目
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitProject(data) {
    return http.post(`/business/inspection/add/item`, { item: data })
  },

  /**
   * 加载巡检项目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadScheduleTableData(schoolId, campusId) {
    return http.get(`/business/inspection/list/duty/${schoolId}/${campusId}`)
  },

  /**
   * 提交巡检排班设置
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitScheduleSetting(data) {
    return http.post(`/business/inspection/add/duty`, { duty: data })
  },

  /**
   * 提交巡检排班批量设置
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitScheduleBatchSetting(data) {
    return http.post(`/business/inspection/batchAdd/duty`, { duty: data })
  },

  /**
   * 加载巡检人
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadInspectors(groupId, campusId) {
    return http.get(`/business/inspection/list/charge/${groupId}/${campusId}`)
  },

  /**
   * 加载巡检消息详情
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadDetails(userId, placeId, msgId) {
    return http.get(`/business/inspection/list/result/${userId}/${placeId}?msgId=${msgId}`)
  }
}
