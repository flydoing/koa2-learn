import http from '@/utils/http'
export default {
  /**
   * 加载学生列表数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadObjectsData(msgId, userId) {
    return http.get(`/business/studentappraisal/students/${msgId}/${userId}`)
  },

  /**
   * 加载家长孩子数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadChildrenData(msgId, userId) {
    return http.get(`/business/studentappraisal/list/childrens/${msgId}`)
  },

  /**
   * 加载学生评估详情
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadStudentApslDetailData(msgId, userId, apslUserId) {
    return http.get(`/business/studentappraisal/list/content/${msgId}/${userId}?appraisalUserId=${apslUserId}`)
  },

  /**
   * 提交学生评估结果
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitStudentApslResult(msgId, userId, apslUserId, data) {
    return http.post(`/business/studentappraisal/add/${msgId}/${userId}?appraisalUserId=${apslUserId}`, data)
  },

  /**
   * 加载评估模板列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadTemplateList(groupId) {
    return http.get(`/business/studentappraisal/list/model/${groupId}`)
  },

  /**
   * 加载评估模板列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadTemplateDetailById(id) {
    return http.get(`/business/studentappraisal/query/model/detail/${id}`)
  },

  /**
   * 加载评估角色
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadProjectRoles(groupId) {
    return http.get(`/business/studentappraisal/list/roles/${groupId}`)
  },

  /**
   * 提交评估模板
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitTemplate(data) {
    return http.post(`/business/studentappraisal/add/model.json`, { model: data })
  },

  /**
   * 加载评估范围
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRangeList(groupId) {
    return http.get(`/business/studentappraisal/list/grade/${groupId}`)
  }

}
