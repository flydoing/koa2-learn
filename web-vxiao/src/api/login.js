import http from '@/utils/http'
/**
 * 登录接口
 */
export default {
  singIn(account, password, url = '/base/aas/auth.json', accessToken, qrCode, timeStamp) {
    try {
      let headers = {
        MFDate: timeStamp,
        'MFUser-Agent': 'version=[Groups(1.0.0_70820)/WebPortal (4.0)/encrypt];info=[identify:cn.mashang.mforce]'
      }
      if (account) {
        headers['Authorization'] = `${account}:${password}`
        headers['account'] = account
        headers['clientId'] = `web${account}`
        headers['encryVer'] = '1.0'
      }
      if (accessToken) {
        headers['accessToken'] = accessToken
      }
      if (qrCode) {
        headers['account'] = qrCode
      }
      return http.get(url, {
        headers: headers
      })
    } catch (e) {}
  },

  /**
   * 加载二维码
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  loadCode(url) {
    return http.get(url)
  },
  getDDJsConfig(params) {
    return http.get(`/thirdparty/dingtalk/jsapi_config`, {
      params
    })
  },
  getDDUser(params) {
    return http.get(`/thirdparty/dingtalk/userinfo`, {
      params
    })
  },
  getDDUserTicket(params) {
    return http.get(`/thirdparty/dingtalk/ticketUserinfo`, {
      params
    })
  },
  ticketUserisnfoBind(dingTalkRequest) {
    return http.post('/thirdparty/dingtalk/ticketUserisnfoBind', { dingTalkRequest: dingTalkRequest })
  },
  // 短信登录
  checkLoginMobile(mobile) {
    // return http.get(`/base/category/queryByType?type=${type}`)
    return http.get(`/base/aas/check/login/${mobile}`)
  },
  loginMobileCode(mobile, code) {
    // return http.get(`/base/category/queryByType?type=${type}`)
    let headers = {
      MFDate: new Date().getTime(),
      'MFUser-Agent': 'version=[Groups(1.0.0_70820)/WebPortal (4.0)/encrypt];info=[identify:cn.mashang.mforce]'
    }
    headers['account'] = mobile
    headers['mobile'] = mobile
    headers['clientId'] = `web${mobile}`
    headers['encryVer'] = '1.0'
    return http.get(`/base/aas/login/${mobile}/${code}`, {
      headers: headers
    })
  }
}
