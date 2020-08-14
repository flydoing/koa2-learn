import http from '@/utils/http'
export default {
  /**
   * 第三方用户签到
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  sign(data) {
    return http.post('/business/meeting/add/record', data)
  },

  /**
   * 获取会议相关数据
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  getMeetingData(msgId, code, state) {
    let query = ``
    if (code && state) {
      query = `?code=${code}&state=${state}`
    }
    return http.get(`/business/meeting/list/item/${msgId}${query}`)
  },

  /**
   * 会议室预定列表
   * @param  {[type]} placeId [description]
   * @return {[type]}      [description]
   */
  getPlaceReserveList(placeId) {
    return http.get(`/business/meeting/listRoomReserve/${placeId}`)
  },

  /**
   * 获取会议地点
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  getPlaces(schoolId, startTime, endTime) {
    return http.get(`/business/meeting/rooms/${schoolId}?startTime=${startTime}&endTime=${endTime}`)
  },

  /**
   * 获取学校地址
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  getSchoolLocation(schoolId) {
    return http.get(`/business/meeting/schoolLocation/${schoolId}`)
  },

  /**
   * 获取消息详情tabs
   * @param  {[type]} groupId [description]
   * @param  {[type]} msgId [description]
   * @return {[type]}      [description]
   */
  getDetailTabs(groupId, msgId) {
    return http.get(`/report/business/tab/1040/${groupId}?msgId=${msgId}`)
  },

  /**
   * 获取消息详情报表
   * @param  {[type]} groupId [description]
   * @param  {[type]} msgId [description]
   * @param  {[type]} queryType [description]
   * @return {[type]}      [description]
   */
  getDetailReport(groupId, msgId, queryType) {
    return http.get(`/report/business/1040/${groupId}?msgId=${msgId}&queryType=${queryType}&noTempletReport=1`)
  }
}
