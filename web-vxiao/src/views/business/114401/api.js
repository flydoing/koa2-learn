import http from '@/utils/http'
export default {
  /**
   * 加载勋章列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadMedalList(groupId) {
    return http.get(`/business/evaluation/list/category/${groupId}`)
  },

  /**
   * 加载显示设置列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadShowSettingList(groupId) {
    return http.get(`/business/evaluation/list/yearschool/show/${groupId}`)
  },

  /**
   * 加载颁发数权限设置表格数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadAuthTableData(groupId) {
    return http.get(`/business/evaluation/upper/limit/info/${groupId}`)
  },

  /**
   * 勋章编辑提交
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitMedalData(data) {
    return http.post('/business/evaluation/add/category.json', {
      category: data
    })
  },

  /**
   * 加载勋章适用范围数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRangeData(groupId) {
    return http.get(`/business/evaluation/use/range/${groupId}`)
  },

  /**
   * 加载勋章适用范围数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadMedalData(medalId) {
    return http.get(`/business/evaluation/query/category/${medalId}`)
  },

  /**
   * 加载勋章适用范围数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadConditionData() {
    return http.get(`/business/evaluation/list/category?type=105`)
  },

  /**
   * 加载評比勛章数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingMedalData(groupId) {
    return http.get(`/business/evaluation/list/ratingMedal/${groupId}`)
  },

  /**
   * 加载极速勋章数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadSpeedMedalData(groupId) {
    return http.get(`/business/evaluation/list/topspeed/${groupId}`)
  },

  /**
   * 设置权限提交
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitAuthData(groupId, data) {
    return http.post(`/business/evaluation/upper/limit/${groupId}`, {
      upperlimit: data
    })
  },

  /**
   * 批量设置权限提交
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitBatchAuthData(groupId, data) {
    return http.post(`/business/evaluation/upper/limit/batchSet/${groupId}`, {
      groupId: groupId,
      upperlimit: data
    })
  },

  /**
   * 加载学生/小组列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadStudentsAndTeams(groupId) {
    return http.get(`/business/evaluation/list/studentList/${groupId}`)
  },

  /**
   * 加载评价用户可选勋章
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadUserMedals(groupId) {
    return http.get(`/business/evaluation/list/category/user/${groupId}`)
  }
}
