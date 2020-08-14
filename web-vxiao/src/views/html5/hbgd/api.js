import http from '@/utils/http'
export default {
  /**
   * [login description]
   * @param  {[type]} account  [description]
   * @param  {[type]} password [密码]
   * @param  {[type]} qrCode   [二维码编号]
   * @return {[type]}          [description]
   */
  login(account, password, url = '/base/aas/auth', accessToken, qrCode) {
    http.defaults.headers['MFDate'] = new Date().getTime()
    http.defaults.headers['MFUser-Agent'] = `version=[Groups(1.0.0_70820)/WebPortal (4.0)];info=[identify:cn.mashang.mforce]`
    if (account) {
      http.defaults.headers['Authorization'] = `${account}:${password}`
      http.defaults.headers['account'] = account
      http.defaults.headers['clientId'] = `web${account}`
    }
    if (accessToken) {
      http.defaults.headers['accessToken'] = accessToken
    }
    if (qrCode) {
      http.defaults.headers['account'] = qrCode
    }
    return http.get(url)
  },

  /**
   * 加载二维码
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  loadCode(url) {
    return http.get(url)
  },
  /**
   * 第三方通用登录
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  loginAuth(url, query) {
    let params = []
    Object.keys(query).forEach((k, i) => {
      params.push(`${k}=${query[k]}`)
    })
    return http.get(`${url}?${params.join('&')}`)
  }
}
