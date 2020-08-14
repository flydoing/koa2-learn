import http from '@/utils/http'

export default {
  /**
   * 获取合同列表
   * @param {[type]} customerId [description]
   * @return {[type]}         [description]
   */
  getContracts(customerId) {
    let url = `/business/crm/list/contract`
    if (customerId) {
      url = `${url}?clientId=${customerId}`
    }
    return http.get(url)
  },
  /**
   * 获取回款合同列表
   * @param  {[type]} customerId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  getPaybackContracts(customerId, appType) {
    let url = `/rest/backpay/query/contract/${customerId}`
    if (appType) {
      url = `${url}?type=${appType}`
    }
    return http.get(url)
  }
}
