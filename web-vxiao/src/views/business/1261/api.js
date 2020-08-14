import http from '@/utils/http'
export default {
  /**
   * 调用微信群上传文件的
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  weixinTemp(groupId, fileId) {
    return http.get(`/business/crm/wechatgroup/parse/excel/${groupId}/${fileId}`)
  },
  weixinDetails(groupId, date) {
    return http.get(`/business/crm/wechatgroup/userstatistics/list/${groupId}/${date}`)
  }
}
