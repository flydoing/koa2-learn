import http from '@/utils/http'
export default {
  /**
   * [loadClass description]
   * @Author   clz
   * @DateTime 2018-09-04
   * @param    {[type]}   groupId
   * @param    {[type]}   startDate
   * @param    {[type]}   endDate
   * @return   {[type]}
   */
  loadClass(groupId, startDate, endDate) {
    let url = `/business/coursetable/class/sheet?groupId=${groupId}&version=2`
    if (startDate) {
      url = `${url}&startDate=${startDate}`
    }
    if (endDate) {
      url = `${url}&endDate=${endDate}`
    }
    return http.get(url)
  },

  /**
   * [loadClass description]
   * @Author   zcy
   * @DateTime 2018-11-13
   * @param    {[type]}   userId
   * @param    {[type]}   startDate
   * @param    {[type]}   endDate
   * @return   {[type]}
   */
  loadUser(userId, startDate, endDate) {
    let url = `/business/coursetable/user/sheet?userId=${userId}&version=2`
    if (startDate) {
      url = `${url}&startDate=${startDate}`
    }
    if (endDate) {
      url = `${url}&endDate=${endDate}`
    }
    return http.get(url)
  },

  /**
   * [loadClass description]
   * @Author   zcy
   * @DateTime 2018-11-13
   * @param    {[type]}   placeId
   * @param    {[type]}   startDate
   * @param    {[type]}   endDate
   * @return   {[type]}
   */
  loadPlace(placeId, startDate, endDate) {
    let url = `/business/coursetable/place/sheet?placeId=${placeId}&version=2`
    if (startDate) {
      url = `${url}&startDate=${startDate}`
    }
    if (endDate) {
      url = `${url}&endDate=${endDate}`
    }
    return http.get(url)
  },

  /**
   * [loadSchool description]
   * @Author   clz
   * @DateTime 2018-09-04
   * @param    {[type]}   schoolId
   * @param    {[type]}   startDate
   * @param    {[type]}   endDate
   * @param    {Number}   type
   * @return   {[type]}
   */
  loadSchool(schoolId, startDate, endDate, type = 1) {
    let url = `/business/coursetable/school/sheet?schoolId=${schoolId}&type=${type}`
    if (startDate) {
      url = `${url}&startDate=${startDate}`
    }
    if (endDate) {
      url = `${url}&endDate=${endDate}`
    }
    return http.get(url)
  },

  /**
   * 周期列表
   * @Author   clz
   * @DateTime 2018-09-04
   * @return   {[type]}
   */
  loadTimes() {
    return http.get(`/business/coursetable/exchange/periods`)
  },

  /**
   * 加载管理员可调课程
   * @Author   zcy
   * @DateTime 2018-10-31
   * @return   {[type]}
   */
  getManagerCourses(id) {
    return http.get(`/business/coursetable/manager/exchange/cells?cellId=${id}`)
  },

  /**
   * 保存调整课程
   * @Author   zcy
   * @DateTime 2018-10-31
   * @return   {[type]}
   */
  saveCourseExchange(data) {
    return http.post(`/business/coursetable/manager/exchange/commit`, data)
  }
}
