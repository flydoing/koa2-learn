import http from '@/utils/http'

export default {
  /**
   * 加载评比方式
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingWays(groupId) {
    return http.get(`/business/dormitoryrating/list/method/${groupId}`)
  },

  /**
   * 加载评比项目数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadProjectData(groupId, isUpdate) {
    let url = `/business/dormitoryrating/list/settings/${groupId}`
    if (isUpdate) {
      url = `${url}?isUpdate=${isUpdate}`
    }
    return http.get(url)
  },

  /**
   * 提交项目
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitProjectData(data) {
    return http.post(`/business/dormitoryrating/add/item`, { ratingItem: data })
  },

  /**
   * 加载评比宿舍列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingDormitories(groupId, date) {
    let url = `/business/dormitoryrating/list/rating/place/${groupId}`
    if (date) {
      url = url.concat(`?sdate=${date}`)
    }
    return http.get(url)
  },

  /**
   * 加载评比项目列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingProjects(groupId, date) {
    let url = `/business/dormitoryrating/list/user/items/${groupId}`
    if (date) {
      url = url.concat(`?sdate=${date}`)
    }
    return http.get(url)
  },

  /**
   * 加载评比项目列表(按宿舍评比)
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingProjectsForDormitory(placeId, date) {
    let url = `/business/dormitoryrating/list/place/result/${placeId}`
    if (date) {
      url = url.concat(`?sdate=${date}`)
    }
    return http.get(url)
  },

  /**
   * 加载评比宿舍列表(按项目评比)
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingDormitoriesForProject(groupId, categoryId, date) {
    let url = `/business/dormitoryrating/list/item/result/${groupId}?categoryId=${categoryId}`
    if (date) {
      url = url.concat(`&sdate=${date}`)
    }
    return http.get(url)
  },

  /**
   * 提交评比数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitRatingData(data) {
    return http.post(`/business/dormitoryrating/dormitory`, { dormitoryRating: data })
  }
}
