import http from '@/utils/http'
export default {
  /**
   * 加载场所列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}         [description]
   */
  loadPlaceList(groupId, type, date) {
    return http.get(`/business/placesubscribe/placeList?groupId=${groupId}&type=${type}&date=${date}`)
  }
}
