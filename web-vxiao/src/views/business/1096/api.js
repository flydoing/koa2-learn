import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'

export default {

  /**
   * 导入课程信息
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  importCourses(params) {
    let ps = []
    C.forEachKeys(params, (k, v) => {
      if (!Check.isNullString(v)) {
        ps.push(`${k}=${v}`)
      }
    })
    return http.get(`/business/optioncourse/import/corporation?${ps.join('&')}`)
  },

  /**
   * 获取课程列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getCourses(schoolId, version) {
    return http.get(`/business/optioncourse/course/list?schoolId=${schoolId}&version=${version}`)
  },

  /**
   * 获取关联空间列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSpaces(schoolId) {
    return http.get(`/business/optioncourse/space/list?schoolId=${schoolId}`)
  },

  /**
   * 获取上课时间表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getTimePeriod(schoolId) {
    return http.get(`/business/optioncourse/timetable?schoolId=${schoolId}`)
  },

  /**
   * 新增或修改选拔课程
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  modifyCourse(schoolId, datas) {
    return http.post(`/business/optioncourse/modify`, { schoolId: schoolId, courses: datas })
  },

  /**
   * 导入禁选学生信息
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  importRestrictStudents(params) {
    let ps = []
    C.forEachKeys(params, (k, v) => {
      if (!Check.isNullString(v)) {
        ps.push(`${k}=${v}`)
      }
    })
    return http.get(`/business/optioncourse/import/restrict?${ps.join('&')}`)
  },

  /**
   * 导入录取学生信息
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  importEnrollStudents(params) {
    let ps = []
    C.forEachKeys(params, (k, v) => {
      if (!Check.isNullString(v)) {
        ps.push(`${k}=${v}`)
      }
    })
    return http.get(`/business/optioncourse/import/default/joiner?${ps.join('&')}`)
  },

  /**
   * 发布选拔
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  saveSelection(data) {
    return http.post(`/business/optioncourse/publish`, data)
  },

  /**
   * 获取选拔详情
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSelectionDetail(publishId) {
    return http.get(`/business/optioncourse/publish/detail?publishId=${publishId}`)
  },

  /**
   * 选拔延时
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  modifyTime(data) {
    return http.post(`/business/optioncourse/publish/modify`, { publish: data })
  },

  /**
   * 获取录取记录列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getEnrollRecords(publishId, courseId) {
    return http.get(`/business/optioncourse/teacher/joinRecords?publishId=${publishId}&courseId=${courseId}`)
  },

  /**
   * 获取课程详情明细
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getCourseDetail(publishId, courseId) {
    return http.get(`/business/optioncourse/detail?publishId=${publishId}&courseId=${courseId}`)
  },

  /**
   * 获取课程详情明细
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getCourseDetailByUserId(publishId, courseId, userId) {
    return http.get(`/business/optioncourse/student/joinDetail?publishId=${publishId}&courseId=${courseId}&userId=${userId}`)
  },

  /**
   * 保存录取学生
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  saveEnrollStudents(data) {
    return http.post(`/business/optioncourse/teacher/enroll`, data)
  },

  /**
   * 获取已发课选课列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getCourseList(data) {
    return http.post(`/business/optioncourse/publish/courses`, { publish: data })
  },

  /**
   * 申报课程
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  applyCourse(data) {
    return http.post(`/business/optioncourse/student/modify`, { joinRecord: data })
  }
}
