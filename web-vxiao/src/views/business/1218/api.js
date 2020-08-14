import http from '@/utils/http'
export default {
  /**
   * 获取某个班群的用户列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getUserList(groupId) {
    return http.get(`/terminal/vbracelet/user/list/${groupId}`)
  },
  /**
   * 绑定卡号
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  bandCardId(d) {
    return http.post(`/terminal/vbracelet/bind/device`, d)
  },
  /**
   * 解绑
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  unbandCardId(d) {
    return http.post(`/business/vcard/delCard`, d)
  },
  /**
   * 批量导入
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  batchImport(d) {
    return http.post(`/terminal/vbracelet/importBracelet`, d)
  }
}
