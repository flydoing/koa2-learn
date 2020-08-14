import http from '@/utils/http'
export default {
  /**
   * 加载学校分组列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadSchoolGroupingList(eId) {
    return http.get(`/business/supervisor/list/group/${eId}`)
  },

  /**
   * 提交学校分组
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitSchoolGrouping(data) {
    return http.post(`/business/supervisor/add/sgroup`, { sgroup: data })
  },

  /**
   * 提交分组评估人
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitGroupingAssessor(data) {
    return http.post(`/business/supervisor/add/sperson`, data)
  },

  /**
   * 加载评估项目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadProjectList(groupId) {
    return http.get(`/business/supervisor/list/item/${groupId}`)
  }
}
