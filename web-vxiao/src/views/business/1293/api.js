import http from '@/utils/http'
export default {
  /**
   * 获取视频会议配置
   * /business/videoconference/trtc/token/5001856
   * @param  {[type]} groupId [description]
   */
  // /business/videoconference/trtc/token/5001856
  getVideoConferenceConfig(groupId) {
    return http.get(`/business/videoconference/trtc/token/${groupId}`)
  }
}
