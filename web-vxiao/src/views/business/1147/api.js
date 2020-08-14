import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'
export default {
  /**
   * 获取模式列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}    [description]
   */
  getModels(schoolId) {
    return http.get(`/rest/courseschedule/interface?schoolId=${schoolId}`)
  },
  /**
   * 保存安排数据
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveScheduleData(data) {
    return http.post(`/rest/courseschedule/edit`, data)
  },

  /**
   * 查询科目信息
   * @param  {[type]} scheduleId [课表Id]
   * @return {[type]}    [description]
   */
  getSubjectInfo(scheduleId) {
    return http.get(`/rest/courseschedule/grade/section?scheduleId=${scheduleId}`)
  },

  /**
   * 查询班级信息
   * @param  {[type]} scheduleId [课表Id]
   * @return {[type]}    [description]
   */
  getClassInfo(scheduleId) {
    return http.get(`/rest/courseschedule/class/list?scheduleId=${scheduleId}`)
  },

  /**
   * 查询教师信息
   * @param  {[type]} schoolId [学校Id]
   * @return {[type]}    [description]
   */
  getTeacherInfo(schoolId) {
    return http.get(`/rest/courseschedule/teacher/infos.json?schoolId=${schoolId}`)
  },

  /**
   * 查询系统名称列表
   * @param  {[type]} options [参数列表]
   * @return {[type]}    [description]
   */
  getSystemNames(options) {
    let url = `/rest/group/manager/defaults`
    let params = []
    C.forEachKeys(options, (k, v) => {
      if (!Check.isNullString(v)) {
        params.push(`${k}=${v}`)
      }
    })
    return http.get(`${url}?${params.join('&')}`)
  },

  /**
   * 编辑班级信息
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  modifyClassInfo(data) {
    return http.post('/rest/group/manager/add', data)
  },

  /**
   * 编辑老师信息
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  modifyTeacherInfo(data) {
    return http.post('/rest/courseschedule/teacher/modify', data)
  },

  /**
   * 查询任教信息
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  getTeachInfo(scheduleId) {
    return http.get(`/rest/courseschedule/subject/teacher/list?scheduleId=${scheduleId}`)
  },

  /**
   * 编辑任教信息
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  modifyTeachInfo(data) {
    return http.post('/rest/courseschedule/subject/teacherAdd', data)
  },

  /**
   * 任教信息(查询教师列表)
   * @param  {[type]} schoolId [学校Id]
   * @param  {[type]} campusId [校区Id]
   * @param  {[type]} courseId [课程Id]
   * @return {[type]}    [description]
   */
  getTeachTeachers(schoolId, campusId, courseId) {
    return http.get(`/rest/courseschedule/subject/teacherList?schoolId=${schoolId}&campusGroupId=${campusId}&courseId=${courseId}`)
  },

  /**
   * 查询课室信息
   * @param  {[type]} schoolId [学校Id]
   * @return {[type]}    [description]
   */
  getRoomInfo(schoolId) {
    return http.get(`/rest/courseschedule/place/list.json?schoolId=${schoolId}`)
  },

  /**
   * 查询规则信息
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  getRuleInfo(scheduleId) {
    return http.get(`/rest/courseschedule/rules?scheduleId=${scheduleId}`)
  },

  /**
   * 设置规则信息
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  setRuleInfo(data) {
    return http.post('/rest/courseschedule/rule/edit', data)
  },

  /**
   * 查询预排课表
   * @param  {[type]} schoolId [学校Id]
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  getCourseTable(schoolId, scheduleId) {
    return http.get(`/rest/courseschedule/schedule/generate?schoolId=${schoolId}&scheduleId=${scheduleId}`)
  },

  /**
   * 查询班级课表
   * @param  {[type]} groupId [班级Id]
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  getClassCourseTable(scheduleId, groupId) {
    return http.get(`/rest/courseschedule/schedule/class/detail?scheduleId=${scheduleId}&groupId=${groupId}`)
  },

  /**
   * 查询可调换课程
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  getExchangeCourses(data) {
    return http.post('/rest/courseschedule/schedule/replaceable', data)
  },

  /**
   * 发布排课课表
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  publishCourseTable(scheduleId) {
    return http.get(`/rest/courseschedule/schedule/publish.json?scheduleId=${scheduleId}`)
  },

  /**
   * 查询时段信息
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  getPeriodInfo(scheduleId) {
    return http.get(`/rest/courseschedule/selectcourse/section/list?scheduleId=${scheduleId}`)
  },

  /**
   * 设置时段信息
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  setPeriodInfo(data) {
    return http.post('/rest/courseschedule/selectcourse/section/edit', data)
  },

  /**
   * 查询选修任教信息
   * @param  {[type]} scheduleId [排课Id]
   * @return {[type]}    [description]
   */
  getElectiveInfo(scheduleId) {
    return http.get(`/rest/courseschedule/bigwalk/generate?scheduleId=${scheduleId}`)
  },

  /**
   * 编辑选修任教信息
   * @param  {[type]} data [参数列表]
   * @return {[type]}    [description]
   */
  modifyElectiveInfo(data) {
    return http.post('/rest/courseschedule/bigwalk/teacher/edit', data)
  },

  /**
   * 导入选课结果
   * @param  {[type]} schoolId [参数列表]
   * @param  {[type]} fileId [参数列表]
   * @return {[type]}    [description]
   */
  importSelectionResult(schoolId, fileId) {
    return http.get(`/rest/selectcourse/import/result/${schoolId}?fileId=${fileId}`)
  }
}
