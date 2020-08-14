import http from '@/utils/http'
export default {
  /**
   * 拉取话题列表
   * @param  {[type]} groupId   [description]
   * @param  {[type]} pageIndex [description]
   * @return {[type]}           [description]
   */
  loadTopics(groupId, pageIndex) {
    return http.post('/rest/tagging/query.json', { groupId: groupId, page: pageIndex })
  }
}
