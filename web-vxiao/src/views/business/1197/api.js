import http from '@/utils/http'
export default {
  /**
   * 加载考勤时间
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadTimes(id) {
    return http.get(`/business/attendance/list/time/settings.json?schoolId=${id}`)
  },

  modifyTimes(d) {
    return http.post(`/business/attendance/modify/time/setting.json`, d)
  },

  /**
   * 加载考勤异常提醒meta
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getRemindMetaData(groupId) {
    return http.get(`/business/attendance/get/attendanceAbnormalOpenSetting/${groupId}`)
  },

  /**
   * 加载病因模板数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getTemplateData(groupId) {
    return http.get(`/business/attendance/list/disease/settings/${groupId}`)
  },

  /**
   * 加载病因模板列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getTemplates(groupId) {
    return http.get(`/business/attendance/list/disease/model/${groupId}`)
  },

  /**
   * 加载考勤时间表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getTimeTable(schoolId) {
    return http.get(`/business/workAttendance/list/listWorkAttendanceNotifySettings?schoolId=${schoolId}`)
  },

  /**
   * 加载考勤对象
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getAttendanceObjects(schoolId) {
    return http.get(`/business/workAttendance/list/listWorkAttendanceNotifyGrade?schoolId=${schoolId}`)
  },

  /**
   * 提交考勤时间节次
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  commitTimeNode(data) {
    return http.post(`/business/workAttendance/update/updateWorkAttendanceNotify`, { attendanceNotifys: [data] })
  },

  /**
   * 删除考勤时间节次
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  removeTimeNode(data) {
    return http.post(`/business/workAttendance/delete/deleteWorkAttendanceNotify`, { attendanceNotifys: [data] })
  }
}
