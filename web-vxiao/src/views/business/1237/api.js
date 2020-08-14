import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'

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
  },

  /**
   * 加载考勤时段
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getAttendancePeriods(groupId) {
    return http.get(`/business/workAttendance/query/attendancePeriods/${groupId}`)
  },

  /**
   * 加载考勤学生列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getStudentList(groupId, type) {
    return http.get(`/business/workAttendance/student/list.json?groupId=${groupId}&periodType=${type}`)
  },

  /**
   * 加载考勤学生列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getChartData(groupId, params) {
    let ps = []
    C.forEachKeys(params, (k, v) => {
      if (!Check.isNullString(v)) {
        ps.push(`${k}=${v}`)
      }
    })
    return http.get(`/business/workAttendance/queryReportChartDatas/${groupId}?${ps.join('&')}`)
  },

  /**
   * 加载疾控上报数据
   * @param  {[type]} schoolId [description]
   * @param  {[type]} date [description]
   * @return {[type]}    [description]
   */
  getDiseaseReportData(schoolId, date) {
    return http.get(`/thirdparty/workDiseaseRest/disease/listDiseaseManager/${schoolId}/${date}`)
  },

  /**
   * 保存疾控上报
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveDiseaseReport(data) {
    return http.post(`/thirdparty/workDiseaseRest/disease/workDiseaseManager/manager`, { workDiseases: [data] })
  },

  /**
   * 保存疾控上报
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  removeDiseaseReport(data) {
    return http.post(`/thirdparty/workDiseaseRest/disease/workDiseaseManager/delete`, { workDiseases: [data] })
  },

  /**
   * 获取疾控病症
   * @param  {[type]}  [description]
   * @return {[type]}    [description]
   */
  getSymptomsAndPathogenys() {
    return http.get(`/thirdparty/workDiseaseRest/disease/workDiseaseManager/listDefaultDiseaseSettings`)
  },

  /**
   * 上报
   * @param  {[type]} schoolId [description]
   * @return {[type]}    [description]
   */
  reportDiseaseRecord(schoolId) {
    return http.get(`/thirdparty/workDiseaseRest/disease/workDiseaseManager/send/${schoolId}`)
  },

  /**
   * 获取wifi列表
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getWifiList(groupId) {
    return http.get(`/business/workAttendance/wifi/list/${groupId}`)
  },

  /**
   * 保存wifi信息
   * @param  {[type]} groupId [description]
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveWifiInfo(groupId, data) {
    return http.post(`/business/workAttendance/wifi/manager/${groupId}`, data)
  },

  /**
   * 获取备注内容
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getRemarkById(id) {
    return http.get(`/business/attendance/student/detail/workAttendanceRemark/get/${id}`)
  },

  /**
   * 保存备注信息
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveRemark(data) {
    return http.post('/business/attendance/student/detail/workAttendanceRemark/save', data)
  },

  /**
   * 保存加班设置
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  saveOvertimeSetting(data) {
    return http.post('/business/workAttendance/notify/addWorkAttendanceNotifyExt', data)
  },

  /**
   * 获取加班设置
   * @param  {[type]} schoolId [description]
   * @return {[type]}         [description]
   */
  getOvertimeSetting(schoolId) {
    return http.get(`/business/workAttendance/notify/getWorkAttendanceNotifyExt?schoolId=${schoolId}&attendanceType=5`)
  }
}
