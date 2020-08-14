import http from '@/utils/http'
export default {
  /**
   * 加载巡检详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadInspectionDetail(msgId, placeId, userId) {
    return http.get(`/business/inspection/list/result/${userId}/${placeId}?msgId=${msgId}`)
  }
}
