import http from '@/utils/http'

export default {
  /**
   * 加载评比方式
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRatingWays(groupId) {
    return http.get(`/business/schoolrating/list/method/${groupId}`)
  },

  /**
   * 加载评比结果
   * @param  {[type]} groupId [description]
   * @param  {[type]} date [description]
   * @return {[type]}         [description]
   */
  getRatingResult(groupId, date) {
    let url = `/business/schoolrating/list/result/${groupId}`
    if (date) {
      url = `${url}?sdate=${date}`
    }
    return http.get(url)
  },

  /**
   * 加载评比项目数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadProjectData(groupId, isUpdate) {
    let url = `/business/schoolrating/list/settings/${groupId}`
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
    return http.post(`/business/schoolrating/metadata`, { metaDatas: [data] })
  },

  /**
   * 提交项目
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitProjectData(data) {
    return http.post(`/business/schoolrating/add/item`, { ratingItem: data })
  },

  /**
   * 提交评比数据
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  commitRatingData(data) {
    return http.post(`/business/schoolrating/school`, { rating: data })
  }
}
