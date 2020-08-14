import http from '@/utils/http'

export default {
  /**
   * 加载学校宿舍列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}    [description]
   */
  getDormitoryList(schoolId) {
    return http.get(`/business/dormitory/list/dormitory/${schoolId}`)
  },

  /**
   * 加载学校宿舍成员列表
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getDormitoryMember(id) {
    return http.get(`/business/dormitory/list/dormitory/user/${id}`)
  },

  /**
   * 添加宿舍成员
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  addDormitoryMember(data) {
    return http.post(`/business/dormitory/userInfo/add`, data)
  },

  /**
   * 删除宿舍成员
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  removeDormitoryMember(id) {
    return http.get(`/business/dormitory/userInfo/delete/${id}`)
  },

  /**
   * 获取班级宿舍成员
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getClassDormitoryMember(groupId) {
    return http.get(`/business/dormitory/list/classInfo/${groupId}`)
  },

  /**
   * 获取班级未安排宿舍的成员
   * @param  {[type]} groupId [description]
   * @return {[type]}    [description]
   */
  getClassMembers(groupId) {
    return http.get(`/base/group/user/noDormitory/${groupId}?userType=4`)
  }
}
