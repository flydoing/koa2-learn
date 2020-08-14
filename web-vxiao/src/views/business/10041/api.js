import http from '@/utils/http'
export default {
  /**
   * 获取商品类型
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  getGoodsTypes(type) {
    let url = `/business/mall/list/goodstype`
    if (type) {
      url = `${url}?type=${type}`
    }
    return http.get(url)
  },

  /**
   * 修改商品类型
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  modifyGoodsTypes(data) {
    return http.post(`/business/mall/update/goodstype`, data)
  },

  /**
   * 获取商品列表
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  getGoodsList(schoolId, keyword, typeIds, status, page) {
    let url = `/business/mall/list/goods/${schoolId}`
    let params = []
    if (keyword) {
      params.push(`key=${keyword}`)
    }
    if (typeIds) {
      params.push(`typeId=${typeIds}`)
    }
    if (status) {
      params.push(`goodsStatus=${status}`)
    }
    if (page) {
      params.push(`page=${page}`)
    }
    return http.get(params.length > 0 ? `${url}?${params.join('&')}` : url)
  },

  /**
   * 获取商品详情
   * @param  {[type]} goodsId [description]
   * @return {[type]}      [description]
   */
  getGoodsDetail(goodsId) {
    return http.get(`/business/mall/query/goodsinfo/${goodsId}`)
  },

  /**
   * 获取商品价格详情
   * @param  {[type]} goodsSchoolId [description]
   * @return {[type]}      [description]
   */
  getPriceDetail(goodsSchoolId) {
    return http.get(`/business/mall/list/goodsprice/${goodsSchoolId}`)
  },

  /**
   * 修改商品
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  modifyGoods(data) {
    return http.post(`/business/mall/update/goodsinfo`, data)
  },

  /**
   * 修改商品状态
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  modifyGoodsStatus(data) {
    return http.post(`/business/mall/update/goodsstatus`, data)
  }
}
