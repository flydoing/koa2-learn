import http from '@/utils/http'
export default {
  /**
   * 获取考场列表
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getPlaces(groupId) {
    return http.get(`/business/reexam/add/info/${groupId}`)
  },

  /**
   * 导入排考总表信息
   * @param  {[type]} schoolId [description]
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  importSummaryArrangeData(schoolId, data) {
    return http.post(`/business/reexam/check/data/${schoolId}`, data)
  },

  /**
   * 获取排考年级
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getGrades(groupId) {
    return http.get(`/business/reexam/list/grade/${groupId}`)
  },

  /**
   * 导入考场座位表信息
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  importSeatArrangeData(data) {
    return http.post(`/business/reexam/list/datas`, data)
  },

  /**
   * 获取考场信息详情
   * @param  {[type]} placeId [description]
   * @return {[type]}    [description]
   */
  getExamPlaceDetail(placeId) {
    return http.get(`/business/reexam/exam/detail/${placeId}`)
  },

  /**
   * 修改考场信息
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  modifyExamPlaceDetail(data) {
    return http.post(`/business/reexam/modifyReexam`, data)
  },

  /**
   * 获取校区年级
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getCampusGrades(groupId) {
    return http.get(`/business/reexam/list/grade/${groupId}`)
  },

  /**
   * 获取科目
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getSubjects(groupId) {
    return http.get(`/business/reexam/list/subject/${groupId}`)
  },

  /**
   * 获取排考考场列表
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  getArrangePlaces(data) {
    return http.post(`/business/reexam/grade/student`, data)
  },

  /**
   * 获取监考考场列表
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  getInvigilatePlaces(data) {
    return http.post('/business/reexam/add/student/place', data)
  },

  /**
   * 获取监考群组列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getInvigilateGroups(groupId) {
    return http.get(`/business/reexam/list/group/${groupId}`)
  }
}
