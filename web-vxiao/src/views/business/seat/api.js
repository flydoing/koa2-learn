import http from '@/utils/http'
export default {
  /**
   * 加载座位表数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getSeats(groupId) {
    return http.get(`/business/seating/query/${groupId}`)
  },

  /**
   * 保存座位表数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  saveSeats(data) {
    return http.post(`/business/seating/add`, { seatTable: data })
  },

  /**
   * 校验座位表导入数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  checkSeatImportData(groupId, data) {
    return http.post(`/business/seating/check/datas/${groupId}`, { dataJson: data })
  },

  /**
   * 导入座位表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  importSeats(groupId, data) {
    return http.post(`/business/seating/import/datas/${groupId}`, { dataJson: data })
  }
}
