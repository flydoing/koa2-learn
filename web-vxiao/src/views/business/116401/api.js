import http from '@/utils/http'
export default {
  /**
   * 加载排考详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadArrangeExamDetail(msgId) {
    return http.get(`/business/reexam/detail/${msgId}`)
  },

  /**
   * 加载场所座位
   * @param  {[type]} placeId [description]
   * @return {[type]}    [description]
   */
  loadSeatsByPlaceId(placeId) {
    return http.get(`/rest/reexam/list/${placeId}`)
  }
}
