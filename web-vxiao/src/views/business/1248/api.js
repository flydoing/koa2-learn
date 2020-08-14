import http from '@/utils/http'
export default {
  /**
   * 获取分类
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getItems(schoolId, groupId) {
    let url = `/business/document/list/item/${schoolId}`
    if (groupId) {
      url = `${url}?groupId=${groupId}`
    }
    return http.get(url)
  },

  /**
   * 添加分类审批人
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  addCategoryApprovers(datas) {
    return http.post(`/business/document/add/user`, { users: datas })
  },

  /**
   * 获取消息审批人
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getMessageApprovers(msgId) {
    return http.get(`/business/document/list/approvers?msgId=${msgId}`)
  },

  /**
   * 保存消息审批人
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveMessageApprovers(data) {
    return http.post(`/business/document/modify/approvers`, data)
  },

  /**
   * 获取公文相关人
   * @param  {[type]} msgId [description]
   * @return {[type]}    [description]
   */
  getDocUsers(msgId) {
    return http.get(`/business/document/getUsers/${msgId}`)
  },

  /**
   * 保存消息审批人
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveMessageRelations(data) {
    return http.post(`/business/document/add/LookuUser`, data)
  }
}
