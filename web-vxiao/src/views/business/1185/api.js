import http from '@/utils/http'
export default {
  /**
   * 布告栏报名
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  noticeBoardSignUp(msgId) {
    return http.get(`/business/noticeboard/entered/${msgId}`)
  }
}
