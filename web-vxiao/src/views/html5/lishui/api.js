import http from '@/utils/http'
export default {
  /**
   * 请求验证信息
   * @type {String}
   */
  loadAuth(url = 'http://sso.lsjyw.net/api/jsonp/?callback=x.vxiao.cn') {
    return http.get(url)
  }
}
