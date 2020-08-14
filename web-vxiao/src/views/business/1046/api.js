import http from '@/utils/http'

export default {
  /**
   * 加载CRM业务列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadCrmAppList(groupId) {
    return http.get(`/business/crm/app/summary?groupId=${groupId}`)
  },

  /**
   * 获取产品列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getProducts(groupId) {
    return http.get(`/business/crm/list/product/manage/${groupId}`)
  },

  /**
   * 加载修改记录
   * @param  {[type]} appType [description]
   * @param  {[type]} businessId [description]
   * @return {[type]}         [description]
   */
  getModifyRecords(appType, businessId) {
    return http.get(`/business/crm/list/modifyRecord/${appType}/${businessId}`)
  }
}
