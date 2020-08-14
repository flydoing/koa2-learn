import http from '@/utils/http'
export default {
  /**
   * 获取评分模板
   * @param {templateId} tId 
   */
  getCommentItem(tId) {
    return http.get(`/business/course/query/template/${tId}`)
  },
  /**
   * 获取评课详情
   * @param {子消息ID} msgId 
   */
  getCommentDetail(msgId) {
    return http.get(`/business/course/query/rating/${msgId}`)
  },
  getTemplateList(groupId, appType, userId, page) {
    return http.get(`/business/course/query/template/list/${groupId}.json?appType=${appType}&userId=${userId}&currentPage=${page}`)
  },
  getTemplateDetail(templateId) {
    return http.get(`/business/course/query/template/${templateId}`)
  },
  getAddData(schoolId, type) {
    return http.get(`/base/category/query.json?groupId=${schoolId}&type=${type}`)
  },
  createTemplate(d) {
    return http.post('/business/course/template/add.json', d)
  },
  getCreateTimer(groupId) {
    return http.get(`/business/timetable/time/schedule/${groupId}`)
  },
  getTeacherList(groupId) {
    return http.get(`/base/group/user/${groupId}`)
  }
}
