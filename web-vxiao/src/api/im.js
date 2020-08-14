import http from '@/utils/http'
export default {
  /**
   * 根据用户id查询im会话列表
   * @param  {[type]} userId [description]
   * @return {[type]}        [description]
   */
  getMessages(userId) {
    return http.get(`/im/query/session/${userId}.json`)
  },
  /**
   * 根据会话Id查找子消息
   * @param  {[type]} sessionId [当前会话Id]
   * @return {[type]} historyId [分页Id，当前列表最早的子消息Id]
   */
  getChildMessages(sessionId, historyId, groupId) {
    let url = `/im/query/message.json?parentId=${sessionId}`
    if (historyId) {
      url = `${url}&id=${historyId}`
    }
    if (groupId) {
      url = `${url}&groupId=${groupId}`
    }
    return http.get(url)
  },
  /**
   * 发送IM
   * @param  {[type]} m [description]
   * @return {[type]}   [description]
   */
  sendMessage(m) {
    return http.post('/im/chat', { message: m })
  },
  /**
   * 消息红点轮询
   * @param  {[ts]} ts [description]
   */
  queryRedot(ts) {
    return http.get(`/business/message/query/redot?ts=${ts}`)
  },
  /**
   * 待办轮询
   * @param  {[ts]} ts [description]
   */
  queryTodoList(groupId, ts) {
    if (ts) {
      return http.get(`/business/message/query/todolist?groupId=${groupId}&ts=${ts}`)
    } else {
      return http.get(`/business/message/query/todolist?groupId=${groupId}`)
    }
  }
}
