import http from '@/utils/http'
export default {
  /**
   * 加载默认处理人
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getDefaultHandlers(groupId) {
    return http.get(`/business/teacherleave/list/approve/person?groupId=${groupId}`)
  },

  /**
   * 获取群组设置数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getSettingData(groupId) {
    return http.get(`/business/teacherleave/approve/rule/${groupId}`)
  },

  /**
   * 获取规则数据
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getRuleDatas(groupId, rule, startTime, endTime) {
    let url = `/business/teacherleave/list/approve/person?groupId=${groupId}`
    if (startTime && endTime) {
      url = `${url}&startTime=${startTime}&endTime=${endTime}`
    } else {
      url = `${url}&rule=${rule}`
    }
    return http.get(url)
  },

  /**
   * 保存规则数据
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveHandlers(data) {
    return http.post(`/business/teacherleave/add/approve/person`, data)
  },

  /**
   * 加载课时
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getClassHours(groupId) {
    return http.get(`/business/timetable/time/schedule/${groupId}`)
  },

  /**
   * 删除规则
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  removeRule(data) {
    return http.post('/business/teacherleave/approve/rule/delete', data)
  }
}
