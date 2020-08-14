import http from '@/utils/http'
export default {
  /**
   * 老师、家长评分
   * @param {请求体} d 
   */
  grading(d) {
    return http.post('/business/homework/score/create.json', d)
  }
}
