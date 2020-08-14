import http from '@/utils/http'

export default {
  /**
   * 获取教师档案数据
   * @param {用户Id} userId
   */
  getTeacherArchives(userId) {
    return http.get(`/rest/teacherarchives/query/teacher/archives/${userId}`)
  },

  /**
   * 获取教师信息
   * @param {用户Id} userId
   */
  getTeacherInfo(userId) {
    return http.get(`/rest/user/query/${userId}`)
  },

  /**
   * 获取教师职务
   * @param {用户Id} userId
   */
  getTeacherJobs(userId) {
    return http.get(`/rest/teacherarchives/query/teacher/job/${userId}`)
  },

  /**
   * 编辑教师信息
   * @param {用户数据} data
   */
  modifyTeacherInfo(data) {
    return http.post(`/rest/user/modify`, data)
  },

  /**
   * 获取教学过程列表
   * @param {用户Id} userId
   */
  getTeachProcessHistory(userId) {
    return http.get(`/rest/teacherarchives/teach/process/report/history?teacherId=${userId}`)
  },

  /**
   * 获取教学过程数据
   * @param {用户Id} userId
   * @param {其他参数} options
   */
  getTeachProcessData(userId, startDate, endDate) {
    return http.get(`/rest/teacherarchives/teach/process/report?teacherId=${userId}&startDate=${startDate}&endDate=${endDate}`)
  },

  /**
   * 获取教学成绩列表
   * @param {用户Id} userId
   */
  getTeachAchievementHistory(userId) {
    return http.get(`/rest/entranceexam/report/history?teacherId=${userId}`)
  },

  /**
   * 获取教学成绩数据
   * @param {用户Id} userId
   * @param {itemId} itemId
   */
  getTeachAchievementData(userId, itemId) {
    return http.get(`/rest/entranceexam/report?teacherId=${userId}&id=${itemId}`)
  },

  /**
   * 获取个人简历列表
   * @param {用户Id} userId
   */
  getResumes(userId) {
    return http.get(`/rest/teacherarchives/query/teacher/curriculumVitae/${userId}`)
  },

  /**
   * 编辑简历
   * @param {请求数据} data
   */
  modifyResume(data) {
    return http.post(`/rest/teacherarchives/add/teacher/curriculumVitae`, data)
  }
}
