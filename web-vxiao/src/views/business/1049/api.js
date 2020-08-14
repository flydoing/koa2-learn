import http from '@/utils/http'

export default {
  /**
   * 加载评比方式
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingWays(groupId) {
    return http.get(`/business/rating/list/method/${groupId}`)
  },

  /**
   * 加载荣誉列表数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadHonorList(groupId) {
    return http.get(`/business/rating/list/medal/${groupId}`)
  },

  /**
   * 加载评比项目数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadProjectData(groupId, isUpdate) {
    let url = `/business/rating/list/settings/${groupId}`
    if (isUpdate) {
      url = `${url}?isUpdate=${isUpdate}`
    }
    return http.get(url)
  },

  /**
   * 提交评比方式
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitRatingWayMeta(data) {
    return http.post(`/business/rating/metadata.json`, { metaDatas: [data] })
  },

  /**
   * 加载评比项目适用范围数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRangeData(groupId) {
    return http.get(`/business/rating/query/item/useRange/${groupId}`)
  },

  /**
   * 提交项目
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitProjectData(data) {
    return http.post(`/business/rating/add/item`, { ratingItem: data })
  },

  /**
   * 加载评比班级荣誉适用范围数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadHonorRangeData(groupId) {
    return http.get(`/business/rating/query/medal/useRange/${groupId}`)
  },

  /**
   * 加载评比班级荣誉适用范围数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadHonorLogoData(groupId) {
    return http.get(`/business/rating/list/medal/logo/${groupId}`)
  },

  /**
   * 提交班级荣誉
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitHonorData(data) {
    return http.post(`/business/rating/add/medal`, { medal: data })
  },

  /**
   * 加载评比班级列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingClasses(groupId, date) {
    let url = `/business/rating/list/rating/groups/${groupId}`
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
    let url = `/business/rating/list/user/items/${groupId}`
    if (date) {
      url = url.concat(`?sdate=${date}`)
    }
    return http.get(url)
  },

  /**
   * 加载评比项目列表(按班级评比)
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingProjectsForClass(groupId, date) {
    let url = `/business/rating/list/group/result/${groupId}`
    if (date) {
      url = url.concat(`?sdate=${date}`)
    }
    return http.get(url)
  },

  /**
   * 加载评比班级列表(按项目评比)
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingClassesForProject(groupId, categoryId, date) {
    let url = `/business/rating/list/item/result/${groupId}?categoryId=${categoryId}`
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
    return http.post(`/business/rating/class`, { groupRating: data })
  },

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
  },

  /**
   * 保存评比图标
   * @param  {[type]} data [description]
   * @return {[type]}    [description]
   */
  saveHonorLogo(data) {
    return http.post('/rest/rating/medal/logo/modify.json', { metas: [data] })
  }
}
