import http from '@/utils/http'
export default {
  /**
   * 加载表单列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getApproveForms(groupId) {
    return http.get(`/business/approve/list/from?groupId=${groupId}`)
  },

  /**
   * 提交表单处理人
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitFormHandlers(groupId, data) {
    return http.post(`/business/approve/add/from/person?groupId=${groupId}`, { approveFrom: data })
  },

  /**
   * 提交表单
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitForm(groupId, data) {
    return http.post(`/business/approve/add/from?groupId=${groupId}`, { approveFroms: [data] })
  }
}
