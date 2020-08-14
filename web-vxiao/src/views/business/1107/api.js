import http from '@/utils/http'

export default {
  /**
   * 获取评比勋章列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getMedals(groupId) {
    return http.get(`/business/evaluation/ratingMedal/sendList/${groupId}`)
  }
}
