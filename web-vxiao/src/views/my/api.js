import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'
export default {
  loadWorks(userId) {
    return http.get(`/rest/category/query/96.json?groupId=${userId}`)
  },
  /**
   * 获取硬件列表
   * @Author   clz
   * @DateTime 2018-09-07
   * @return   {[type]}   [description]
   */
  loadVCards() {
    return http.get('/business/vcard/user')
  },
  /**
   * 获取用户课表
   * @Author   clz
   * @DateTime 2018-09-07
   * @param    {[type]}   userId    [description]
   * @param    {[type]}   startDate [description]
   * @param    {[type]}   endDate   [description]
   * @return   {[type]}             [description]
   */
  loadCourseTable(userId, startDate, endDate) {
    let url = `/business/coursetable/user/sheet?userId=${userId}`
    if (startDate && endDate) {
      url = `${url}&startDate=${startDate}&endDate=${endDate}`
    }
    return http.get(url)
  },
  /**
   * 个人中心应用入口
   * @Author   clz
   * @DateTime 2018-09-21
   * @return   {[type]}   [description]
   */
  loadApps() {
    return http.get('/base/user/entrance/apps')
  },
  /**
   * 根据应用类型查询用户（孩子）列表
   * @Author   clz
   * @DateTime 2018-09-21
   * @param    {[type]}   appType [description]
   * @return   {[type]}           [description]
   */
  loadAppUsers(appType) {
    return http.get(`/base/user/app/users?appType=${appType}`)
  },
  /**
   * [loadConsumeDetails description]
   * @Author   clz
   * @DateTime 2018-09-21
   * @param    {[type]}   pageNum [description]
   * @return   {[type]}           [description]
   */
  loadConsumeDetails(userId, pageNum = 1) {
    return http.get(`/business/vcard/detail/user/${userId}?pageNum=${pageNum}`)
  },

  /**
   * [loadBooksTable description]
   * @Author   zcy
   * @DateTime 2019-01-16
   * @param    {[type]}   options [description]
   * @return   {[type]}           [description]
   */
  loadBooksTable(options) {
    let url = `/report/business/userReport/1150`
    let params = []
    C.forEachKeys(options, (k, v) => {
      if (!Check.isNullString(v)) {
        params.push(`${k}=${v}`)
      }
    })
    return http.get(`${url}?${params.join('&')}`)
  },
  addCategory(data) {
    return http.post('/rest/category/add.json', data)
  },
  /**
   * [getExercisies description]
   * @Author   zcy
   * @DateTime 2019-05-15
   * @param    {[type]}   page [description]
   * @param    {[type]}   categoryId [description]
   * @return   {[type]}           [description]
   */
  getQuestions(page, categoryId) {
    let url = `/business/praxis/mistakeAnswer/list?&currentPage=${page}`
    if (categoryId) {
      url = `${url}&categoryId=${categoryId}`
    }
    return http.get(url)
  },
  /**
   * [getExercisies description]
   * @Author   zcy
   * @DateTime 2019-05-16
   * @return   {[type]}           [description]
   */
  getExercisesCategorys() {
    return http.get('/business/praxis/mistakeAnswer/category')
  }
}
