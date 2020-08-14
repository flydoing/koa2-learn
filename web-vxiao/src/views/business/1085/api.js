import http from '@/utils/http'

export default {
  /**
   * 获取产品列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getProducts(groupId) {
    return http.get(`/business/crm/list/product/manage/${groupId}`)
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
  },

  /**
   * 获取项目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getProjects(ops) {
    let url = `/business/crm/project/list`
    if (ops.groupId) {
      url = `${url}?groupId=${ops.groupId}`
    }
    if (ops.clientId) {
      url = `${url}?clientId=${ops.clientId}`
    }
    return http.get(url)
  }
}
