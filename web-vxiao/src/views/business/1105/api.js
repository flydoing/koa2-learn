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
  },
  /**
   * 获取在借产品列表
   * @param  {[type]} groupId [description]
   * @param  {[type]} userId [description]
   * @return {[type]}      [description]
   */
  getBorrowList(groupId, userId) {
    return http.get(`/business/crm/product/inBorrow?groupId=${groupId}&userId=${userId}`)
  }
}
