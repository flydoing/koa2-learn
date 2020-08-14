import http from '@/utils/http'
export default {
  /**
   * 第三方用户签到
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  sign(user) {
    return http.post('/business/meeting/outside/sign.json', { person: user })
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
   * 获取饼图数据
   * @param  {[type]} schoolId [description]
   * @return {[type]}      [description]
   */
  getPieData(msgId, date) {
    return http.get(`/business/punchcard/query/chart?msgId=${msgId}&sdate=${date}`)
  },

  /**
   * 获取打卡用户
   * @param  {[type]} msgId [description]
   * @param  {[type]} sdate [description]
   * @return {[type]}      [description]
   */
  getUsers(msgId, sdate) {
    return http.get(`/business/punchcard/students/list?msgId=${msgId}&sdate=${sdate}`)
  }
}
