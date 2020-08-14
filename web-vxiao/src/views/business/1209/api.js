import http from '@/utils/http'

export default {

  /**
   * 加载自动全景瞬间列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadAutoMoments(schoolId) {
    return http.get(`/business/vr/list/autoVR/${schoolId}`)
  },

  /**
   * 加载场所列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadPlaces(schoolId) {
    return http.get(`/business/place/list?schoolId=${schoolId}&isShowTypeName=1`)
  },

  /**
   * 加载自动全景瞬间场所列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadMomentPlaces(schoolId) {
    return http.get(`/business/vr/list/vrPlace/${schoolId}`)
  },

  /**
   * 提交自动全景瞬间
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitAutoMoment(data) {
    return http.post(`/business/vr/modify/autoVR`, { autoVR: data })
  },

  /**
   * 加载全景设备列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadEquipments(schoolId) {
    return http.get(`/business/vr/list/carema/${schoolId}`)
  },

  /**
   * 提交全景设备
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitEquipment(data) {
    return http.post(`/business/vr/modify/carema`, { carema: data })
  },

  /**
   * 加载受影响的自动全景瞬间列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadInfluencedList(placeId) {
    return http.get(`/business/vr/list/place/autoVR/${placeId}`)
  }
}
