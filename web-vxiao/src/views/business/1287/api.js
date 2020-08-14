import http from '@/utils/http'
export default {
  /**
   * 获取外网学校列表
   * @param  {[type]} keyword [description]
   * @param  {[type]} page [description]
   * @return {[type]}      [description]
   */
  getSchools(keyword, page) {
    return http.get(`/business/crm/peschools?name=${keyword}&currentPage=${page}`)
  }
}
