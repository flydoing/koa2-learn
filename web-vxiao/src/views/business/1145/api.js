import http from '@/utils/http'
export default {
  /**
   * 加载值日表格数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getDutyTableData(schoolId, campusId, isOddWeeks) {
    let url = `/business/schoolduty/query/school/table/${schoolId}?campusId=${campusId}`
    isOddWeeks && (url = `${url}&isOddWeeks=${isOddWeeks}`)
    return http.get(url)
  },

  /**
   * 提交当值人员
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitOnDutyMembers(datas) {
    return http.post(`/business/schoolduty/add/user`, { dutyUsers: datas })
  }
}
