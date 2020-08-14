import http from '@/utils/http'
export default {
  /**
   * 拉取某一条消息
   * @param {消息Id} msgId 
   */
  getTheMsg(msgId) {
    return http.get(`/business/message/query/detail/${msgId}`)
  },
  /**
   * 获取范文子消息列表
   * @param {当前群Id} groupId 
   * @param {主消息Id} parentId 
   * @param {应用类型} appType 
   * @param {页码} currentPage 
   */
  getDetaillist(groupId, parentId, appType, currentPage = 1) {
    return http.get(`/business/message/query/${groupId}?currentPage=${currentPage}&queryType=parentId&parentId=${parentId}&type=${appType}`)
  },
  /**
   * 提交读后感
   * @param {*} d 
   */
  addModelEssay(d) {
    return http.post('/business/message/add', d)
  },
  getKeywords(keyword = '') {
    return http.get(`/business/modelessay/keyword/search.json?word=${keyword}`)
  }
}
