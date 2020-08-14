import http from '@/utils/http'
export default {
  /**
   * 获取目录列表
   * @param {*} isCount 
   * @param {*} isGlobal 
   * @param {*} isSerial 
   */
  loadCategorys(groupId, isCount = 1, isGlobal = 1, isSerial = 1) {
    return http.get(`/business/course/query/chapter/${groupId}.json?isCount=${isCount}&isGlobal=${isGlobal}&isSerial=${isSerial}`)
  },
  /**
   * 根据目录查询消息列表
   * @param {*} categoryId 
   * @param {*} currentPage 
   */
  loadCategoryChildMsg(groupId, categoryId, currentPage = 1) {
    return http.get(`/business/message/query/${groupId}?currentPage=${currentPage}&queryType=category&categoryId=${categoryId}&type=1199`)
  }
}
