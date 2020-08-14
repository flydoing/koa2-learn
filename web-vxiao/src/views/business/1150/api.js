import http from '@/utils/http'
export default {
  /**
   * 拉取V图绑定列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getBookVScreens(schoolId) {
    return http.get(`/business/book/query/vscreensum/${schoolId}`)
  },
  /**
   * 获取详情
   * @param  {[type]} id          [description]
   * @param  {Number} currentPage [description]
   * @return {[type]}             [description]
   */
  getBookVScreenDetail(id, currentPage = 1) {
    return http.get(`/business/book/query/vscreenbks/${id}?currentPage=${currentPage}`)
  },
  /**
   * 绑定
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  band(d) {
    return http.post(`/business/book/bind/device`, d)
  },
  /**
   * 解除绑定
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  unband(d) {
    return http.post('/business/book/unbind/device', d)
  },

  /**
   * 根据关键字查询书籍
   * @param  {[type]} keyword [description]
   * @param  {[type]} page [description]
   * @return {[type]}   [description]
   */
  getBooks(keyword, page) {
    return http.get(`/business/book/seach?schoolId=14343&keyword=${keyword}&currentPage=${page}`)
  },

  /**
   * 获取图书借阅天数
   * @param  {[type]} schoolId [description]
   * @return {[type]}   [description]
   */
  getDayMetaDta(schoolId) {
    return http.get(`/business/book/metaData/query?schoolId=${schoolId}`)
  },

  /**
   * 获取消息报表数据
   * @param {消息ID} msgId
   * @param {群主ID} groupId
   */
  getMessageReport(type, groupId, msgId) {
    return http.get(`/report/business/${type}/${groupId}?msgId=${msgId}&noTempletReport=1`)
  },

  /**
   * 获取图书信息
   * @param {ISBN} isbn
   */
  getBookInfo(isbn) {
    return http.get(`/business/book/query/isbn/${isbn}`)
  },
  /**
   * 获取图书类型
   */
  getBookType() {
    return http.get(`/business/book/getBookType`)
  }
}
