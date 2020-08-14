import http from '@/utils/http'
export default {
  /**
   * 加载奖章列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadMedalList(groupId) {
    return http.get(`/business/colorrating/list/medals/${groupId}`)
  },

  /**
   * 加载维度颁发权限用户
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadDimensionUsers(categoryId) {
    return http.get(`/business/colorrating/user/query/${categoryId}`)
  },

  /**
   * 提交维度颁发权限用户
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitDimensionUsers(datas) {
    return http.post(`/business/colorrating/user/add`, { ratingUsers: datas })
  },

  /**
   * 加载用户可发奖章列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadUserMedalList(groupId) {
    return http.get(`/business/colorrating/user/medals/${groupId}`)
  }
}
