import http from '@/utils/http'
export default {
  /**
   * 加载课程表
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  getCourseTable(schoolId, userId, start, end) {
    return http.get(`/business/coursetable/teacher/sheet?schoolId=${schoolId}&userId=${userId}&startDate=${start}&endDate=${end}`)
  },

  /**
   * 加载时间段
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  getTimePeriods(groupId, date) {
    let url = `/business/coursetable/exchange/periods`
    if (groupId && date) {
      url = `${url}?groupId=${groupId}&sdate=${date}`
    }
    return http.get(url)
  },

  /**
   * 加载可调课程
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  getExCourses(cellId, start, end) {
    return http.get(`/business/coursetable/exchange/cells?cellId=${cellId}&startDate=${start}&endDate=${end}`)
  },

  /**
   * 加载可代课老师
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  getSubTeachers(userId, cellId, start, end, subjectId) {
    let url = `/business/coursetable/substitution/teachers?userId=${userId}&cellId=${cellId}&startDate=${start}&endDate=${end}`
    if (subjectId) {
      url = `${url}&subjectId=${subjectId}`
    }
    return http.get(url)
  },

  /**
   * 保存调代课
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  saveCourse(data) {
    return http.post(`/business/coursetable/exchange/commit`, data)
  },

  /**
   * 加载可调课程
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  cancelCourseExchange(schoolId, userId, type) {
    return http.get(`/business/coursetable/exchange/cancel?schoolId=${schoolId}&userId=${userId}&type=${type}`)
  }
}
