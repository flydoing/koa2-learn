import http from '@/utils/http'

export default {
  /**
   * 获取代理商列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getAgents(groupId) {
    return http.get(`/rest/agent/query/${groupId}`)
  },
  /**
   * 获取代理商信息
   * @param  {[type]} agentId [description]
   * @return {[type]}         [description]
   */
  getAgentInfo(agentId) {
    return http.get(`/business/crm/agent/${agentId}`)
  },

  /**
   * 获取代理商联系人列表
   * @param  {[type]} aid [description]
   * @return {[type]}         [description]
   */
  getContacts(aid) {
    return http.get(`/rest/agent/query/contact/${aid}`)
  }
}
