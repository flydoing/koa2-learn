import http from '@/utils/http'
export default {
  /**
   * 导入excel数据
   * @return {[type]}         [description]
   */
  importData(params) {
    return http.post('/bigdata/yjl/import', params)
  }
}
