import http from '@/utils/http'
export default {
  /**
   * 根据用户id查询基础数据（群、群关系、应用、应用关系）
   * @return {[type]}        [description]
   */
  getUserBase() {
    return http.get('/base/group/v2/query')
  },
  /**
   * 加载登录用户的群用户类型集合
   * @param  {[type]} userId [description]
   * @return {[type]}        [description]
   */
  getUserTypes(userId) {
    return http.get(`/base/user/type/${userId}`)
  },

  /**
   * 查询登录用户的个人信息（基础信息、工作状态、学生数据集合等）
   * @return {[type]} [description]
   */
  getUserDetail() {
    return http.get('/base/user/myself.json')
  },

  /**
   * 拉取主题列表（包括自己上传）
   * @return {[type]} [description]
   */
  getThemes() {
    return http.get('/base/user/background')
  },
  /**
   * 修改用户信息
   * @param  {[type]} u [description]
   * @return {[type]}   [description]
   */
  modifyUser(u) {
    return http.post('/base/user/add', { user: u })
  },
  /**
   * 修改密码
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyPassword(d, headers) {
    return http.post(
      '/base/aas/changePwd',
      {
        validate: d
      },
      {
        headers: headers
      }
    )
  },
  /**
   * 忘记密码-验证手机号码，或者学号
   * @Author   clz
   * @DateTime 2018-09-19
   * @param    {[type]}   account [description]
   * @return   {[type]}           [description]
   */
  checkAccount(account, headers, code, ts) {
    return http.get(`/base/aas/checkAccount/${account}?vcode=${code}&ts=${ts}`, {
      headers: headers
    })
  },

  /**
   * 忘记密码-验证短信验证码
   * @Author   zcy
   * @DateTime 2019-03-25
   * @param    {[type]}   account [description]
   * @param    {[type]}   vcode [description]
   * @return   {[type]}           [description]
   */
  checkSMSCode(account, code) {
    return http.get(`/base/aas/vcode/check/${account}/${code}`)
  },

  /**
   * 忘记密码-获取短信验证码
   * @Author   clz
   * @DateTime 2018-09-19
   * @param    {[type]}   account [description]
   * @param    {[type]}   code    [description]
   * @param    {[type]}   ts      [description]
   * @return   {[type]}           [description]
   */
  getSMSCode(account, code, ts) {
    return http.get(`/base/aas/verifycode/${account}/${code}?ts=${ts}`)
  },

  /**
   * 修改手机号码-获取短信验证码
   * @Author   zcy
   * @DateTime 2019-03-26
   * @param    {[type]}  mobile [description]
   * @return   {[type]}           [description]
   */
  getCode(mobile) {
    return http.get(`/base/aas/vcode/${mobile}`)
  },

  /**
   * 忘记密码-重置密码
   * @Author   clz
   * @DateTime 2018-09-20
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  forgetPwd(d, headers) {
    return http.post('/base/aas/forgetPwd', d, {
      headers: headers
    })
  },
  /**
   * 忘记密码-验证用户信息是否正确
   * @Author   clz
   * @DateTime 2018-09-20
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  checkUserByNo(d) {
    return http.get('/base/aas/checkUserInfoByStuNo', d)
  },
  /**
   * 查询用户基础信息
   * @author clz
   * @date 2019-02-26
   * @param {*} userId
   * @param {number} [type=1]
   */
  getUserBaseById(userId, type = 1) {
    return http.get(`/base/user/${userId}?type=${type}`)
  }
}
