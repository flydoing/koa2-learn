import http from '@/utils/http'
export default {
  /**
   * 加载岗位列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  loadPostList(groupId) {
    return http.get(`/rest/handover/listCampusPosts.json?groupId=${groupId}`)
  }
}
