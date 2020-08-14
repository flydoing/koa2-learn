import http from '@/utils/http'
import C from '@/utils/object'

// 分类数据拉取类
export default {

  /**
   * 获取分类数据
   * @param  {[type]} type [description]
   * @return {[type]}         [description]
   */
  getCategorys({ type, ...args }) {
    let url = `/base/category/query.json?type=${type}&`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },

  /**
   * 根据分类查找所有分类
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  getCategorysByType(type) {
    return http.get(`/base/category/queryByType?type=${type}`)
  },

  /**
   * 根据多个类型查找所有分类
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  getCategorysByTypes(type) {
    return http.get(`/rest/category/query/${type}`)
  },

  /**
   * 根据类型查找群组下的分类
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  getGroupCategoryByType(groupId, type) {
    return http.get(`/base/category/query/${groupId}/${type}`)
  },

  /**
   * 分类编辑
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  addCategory(datas) {
    return http.post(`/base/category/add.json`, { categorys: datas })
  },
  /**
   * 举报
   * @return {[type]} [description]
   */
  getComplain() {
    return http.get('/base/category/query.json?type=complaintype')
  }
}
