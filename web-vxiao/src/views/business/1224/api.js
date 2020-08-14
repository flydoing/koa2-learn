import http from '@/utils/http'
export default {
  /**
   * 调用微信群上传文件的
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  tacitlyApprove(appType, groupId) {
    return http.get(`/business/crm/defaultperson/${appType}/${groupId}`)
  },
  addOrremove(persons) {
    return http.post(`/business/crm/defaultperson/add`, persons)
  }
}
