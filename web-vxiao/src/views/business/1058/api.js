import http from '@/utils/http'
import C from '@/utils/object'
export default {
  /**
   * 加载食谱详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadFoodMenuDetail(msgId, userId) {
    return http.get(`/business/cookbook/detail/${msgId}.json?userId=${userId}`)
  },

  loadFoodMenuDetailV2(msgId, userId) {
    return http.get(`/business/cookbook/detailV2/${msgId}.json?userId=${userId}`)
  },

  /**
   * 加载食谱详情菜单列表
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadFoodMenuDetailList(menuId, groupId, userId) {
    return http.get(`/business/cookbook/query/order/detail?cookbookId=${menuId}&groupId=${groupId}&userId=${userId}`)
  },

  /**
   * 提交用户餐点
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  commitUserMeals(data) {
    return http.post(`/business/cookbook/user/order`, data)
  },
  /**
   * 加载 餐次管理 列表
   * @param {*} groupId 
   */
  loadMealTime(groupId) {
    return http.get(`/business/cookbook/query/mealtime/${groupId}.json?`)
  },
  /**
   * 修改餐次
   * @param {*} d 
   */
  modifyMealTime(d) {
    return http.post('/business/cookbook/mealtime/add.json', d)
  },
  /**
   * 消费情况
   * @param {*} schoolId 
   */
  loadConsumption(schoolId) {
    return http.get(`/business/cookbook/query/consume/list/${schoolId}.json`)
  },
  /**
   * 消费情况详情
   * @param {*} schoolId 
   * @param {*} date 
   */
  loadConsumptionDetail(schoolId, date) {
    return http.get(`/business/cookbook/query/consume/detail/${schoolId}.json?date=${date}`)
  },
  /**
   * 加载菜品库列表
   * @param {学校groupId} sgip 
   */
  loadFoodLibrary(sgip, { ...args
  }) {
    let link = `/business/cookbook/food/query/${sgip}?`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      link = `${link}${k}=${v}&`
    })
    return http.get(link)
  },
  /**
   * 修改菜式
   * @param {*} d 
   */
  modifyFoodInfo(d) {
    return http.post('/business/cookbook/food/add', d)
  },
  /**
   * 导入模板
   * @param {*} d 
   */
  importTemplate(d) {
    return http.post('/business/cookbook/food/import.json', d)
  },
  /**
   * 获取学校饭堂信息
   * @param {*} categoryType 
   * @param {*} groupId 
   */
  loadCanteenInfo(categoryType, groupId) {
    // return http.get(`/rest/category/query/${categoryType}.json?groupId=${groupId}`)
    return http.get(`/base/category/query.json?type=${categoryType}&groupId=${groupId}`)
  },
  /**
   * 修改饭堂信息
   * @param {*} d 
   */
  modifyCanteen(d) {
    return http.post('/base/category/add.json', d)
  },
  /**
   * 获取 是否允许 点餐信息
   * @param {*} schoolId 
   */
  getAllowOrder(schoolId) {
    // return http.get(`/rest/metadata/query.json?userId=${schoolId}&metaType=${metaType}`)
    return http.get(`/business/cookbook/settings?schoolId=${schoolId}`)
  },
  /**
   * 设置 是否 允许点餐
   * @param {*} d 
   */
  setAllowOrder(d) {
    // return http.post('/rest/metadata/add.json', d)
    return http.post('/business/cookbook/settings/add', d)
  },
  /**
   * 获取餐次
   * @param {*} groupId 
   */
  getMealTime(groupId) {
    return http.get(`/business/cookbook/query/mealtime/${groupId}.json`)
  },
  // 解析菜谱模板（新建）
  parseTemplate(groupId, fileId) {
    return http.get(`/business/cookbook/menu/import?groupId=${groupId}&fileId=${fileId}`)
  },
  getCanteenlList(schoolId) {
    return http.get(`/business/cookbook/canteen/list?schoolId=${schoolId}`)
  }
}
