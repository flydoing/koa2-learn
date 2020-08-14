import http from '@/utils/http'
export default {
  /**
   * 加载兑奖历史
   * @param  {[type]} schoolId [description]
   * @return {[type]}    [description]
   */
  getPrizeHistroy(schoolId, page) {
    return http.get(`/business/prize/list/history/${schoolId}?currentPage=${page}`)
  },

  /**
   * 加载兑奖记录
   * @param  {[type]} schoolId [description]
   * @return {[type]} type [1：未处理，2：已处理]
   */
  getRecordList(schoolId, sDate, eDate, type, page) {
    return http.get(`/business/prize/list/records/${schoolId}?startDate=${sDate}&endDate=${eDate}&type=${type}&currentPage=${page}`)
  },

  /**
   * 查询奖品列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}
   */
  getPrizeList(schoolId, groupId, userId) {
    let url = `/business/prize/list?schoolId=${schoolId}`
    if (userId) {
      url = `${url}&groupId=${groupId}&userId=${userId}`
    }
    return http.get(url)
  },

  /**
   * 提交奖品
   * @param  {[type]} data [description]
   * @return {[type]}
   */
  commitPrize(data) {
    return http.post('/business/prize/add', { prize: data })
  },

  /**
   * 提交奖品补货数量
   * @param  {[type]} datas [description]
   * @return {[type]}
   */
  commitPrizeCount(datas) {
    return http.post('/business/prize/supplement', { prizes: datas })
  },

  /**
   * 获取学生列表
   * @param  {[type]} datas [description]
   * @return {[type]}
   */
  getChildren(groupId) {
    return http.get(`/business/evaluation/list/child/${groupId}`)
  },

  /**
   * 获取学期兑换数量限制
   * @param  {[type]} schoolId [description]
   * @return {[type]}
   */
  getExchangeLimitMeta(schoolId) {
    return http.get(`/business/prize/settings?schoolId=${schoolId}`)
  }
}
