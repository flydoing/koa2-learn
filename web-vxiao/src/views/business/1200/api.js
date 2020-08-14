import http from '@/utils/http'
export default {
  /**
   * 获取考场列表
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getPraxisList(groupId, currentPage) {
    return http.get(`/business/praxis/query?groupId=${groupId}&isFirst=1&queryType=1073&range=8&currentPage=${currentPage}`)
  },
  /**
   * 获取课程班级
   * @param  {[type]} type [description]
   * @return {[type]}    [description]
   */
  getCourseGroup(type) {
    return http.get(`/business/course/query/forwardcourses?appType=${type}`)
  }
}
