import http from '@/utils/http'

export default {
  /**
   * 加载考勤时段
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getAttendancePeriods(groupId) {
    return http.get(`/business/workAttendance/query/attendanceDormitoryPeriods/${groupId}`)
  },
  /**
   * 加载考勤学生列表
   * @param  {[type]} placeId [description]
   * @param  {[type]} placeId [description]
   * @return {[type]}    [description]
   */
  getStudents(placeId, period) {
    return http.get(`/business/workAttendance/student/list/listAttendanceDormitoryStudents?placeId=${placeId}&periodType=${period}`)
  }
}
