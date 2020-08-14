import http from '@/utils/http'
export default {
  /**
   * 删除栏目
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  removeColumnById(id) {
    return http.get(`/business/security/getColumnMsgCount/${id}`)
  }
}
