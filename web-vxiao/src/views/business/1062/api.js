import http from '@/utils/http'

export default {
  /**
   * 新增客户
   * @param  {[type]} data [description]
   * @param  {[type]} binMsgId [description]
   * @return {[type]}         [description]
   */
  addCustomer(data, binMsgId) {
    let url = '/business/crm/add/client'
    if (binMsgId) {
      url = `${url}?msgId=${binMsgId}`
    }
    return http.post(url, data)
  },

  /**
   * 查询客户详情
   * @param  {[type]} id [description]
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getCustomerInfo(id, groupId) {
    return http.get(`/business/crm/query/client/${id}?groupId=${groupId}`)
  },

  /**
   * 修改客户
   * @param  {[type]} msgId [description]
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyCustomer(data, msgId) {
    return http.post(`/business/crm/modify/client/${msgId}`, data)
  },

  /**
   * 获取客户列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getCustomers(groupId) {
    return http.get(`/business/crm/query/client?groupId=${groupId}`)
  },

  /**
   * 获取客户联系人列表
   * @param  {[type]} cid [description]
   * @return {[type]}         [description]
   */
  getContacts(cid) {
    return http.get(`/rest/crm/client/contact/list?clientId=${cid}`)
  }
}
