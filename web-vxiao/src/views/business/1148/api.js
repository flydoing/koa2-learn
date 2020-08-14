import http from '@/utils/http'
export default {
  /**
   * 加载岗位列表
   * @param  {[type]} groupId [description]
   * @param  {[type]} userId [description]
   * @return {[type]}    [description]
   */
  loadPostList(groupId, userId) {
    let url = `/rest/handover/listCampusPosts?groupId=${groupId}`
    if (userId) {
      url = `${url}&userId=${userId}`
    }
    return http.get(url)
  },

  /**
   * 加载交班人列表
   * @param  {[type]} groupId [description]
   * @param  {[type]} categoryId [description]
   * @return {[type]}    [description]
   */
  getOffGoings(groupId, categoryId) {
    return http.get(`/rest/handover/getPostsUser.json?groupId=${groupId}&categoryId=${categoryId}`)
  },

  /**
   * 加载交接班日志
   * @param  {[type]} categoryId [description]
   * @return {[type]}    [description]
   */
  getDiary(categoryId) {
    return http.get(`/rest/handover/getLastHandOver?categoryId=${categoryId}`)
  }
}
