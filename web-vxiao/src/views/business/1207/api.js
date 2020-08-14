import http from '@/utils/http'
export default {
  getAirCategorys({ type = 175, parentId, isDefault = 0 }) {
    return http.get(`/base/category/query?type=${type}&parentId=${parentId}&isDefault=${isDefault}`)
  },
  /**
   * 查询已经绑定的场所
   */
  getSite(schoolId) {
    return http.get(`/terminal/viot/list/placesHaveBind/${schoolId}`)
  },
  /**
   * 查询某个场所下所有的VIOT设备以及开关状态/模式等信息
   */
  getPlaceId(placeId, schoolId) {
    return http.get(`/terminal/viot/listStatus/${placeId}?schoolId=${schoolId}`)
  },
  /**
   * 应用设置拿到学校下的所有场所
   */
  getSchool(schoolId) {
    return http.get(`/terminal/viot/list/places/${schoolId}`)
  },
  /**
   * 应用设置查询场所下的所有应用设备
   */
  getAllfacility(placeId) {
    return http.get(`/terminal/viot/list/${placeId}`)
  },
  /**
   * 模式
   */
  getPattern(placeId) {
    return http.get(`/terminal/viot/list/${placeId}`)
  },
  /**
   * 开关设备状态
   */
  potSwitchState(viot) {
    return http.post('/terminal/viot/viot/modifyStatus', viot)
  },
  /**
   * 新增和修改模式
   */
  addViots(viotStyle) {
    return http.post('/terminal/viot/style/add', viotStyle)
  },
  /**
   * 选择模式
   */
  getChoicePattern(placeId, styleId) {
    return http.get(`/terminal/viot/selectStyle/${placeId}/${styleId}`)
  },
  /**
   * 关闭模式
   */
  getChoiceClose(placeId, styleId) {
    return http.get(`/terminal/viot/closeStyle/${placeId}/${styleId}`)
  },
  /**
   * 应用设置查询所有模式
   */
  getAllModes(schoolId) {
    return http.get(`/terminal/viot/listStyle/${schoolId}`)
  },
  /**
   * 应用设置查询模式详情
   */
  modelDetails(styleId) {
    return http.get(`/terminal/viot/getStyleById/${styleId}`)
  },
  /**
   * 应用设置新增模板
   */
  getAddModel() {
    return http.get(`/terminal/viot/getCategoryList`)
  },
  /**
   * 新增/修改viot
   * @param  {[type]} viot [description]
   * @return {[type]}      [description]
   */
  addViot(viot) {
    return http.post('/terminal/viot/add', viot)
  },
  /**
   * 根据groupId，获取当前群所在的场所信息
   * @param {*} groupId
   */
  getGroupPlace(groupId) {
    return http.get(`/terminal/viot/getPlaceId/${groupId}`)
  }
}
