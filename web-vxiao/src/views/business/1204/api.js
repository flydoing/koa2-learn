import http from '@/utils/http'
export default {
  getVpadsList(schoolId) {
    return http.get(`/terminal/vpad/${schoolId}`)
  },
  saveVpad(d) {
    return http.post('/terminal/vpad/add', d)
  },
  /**
   * 网络访问白名单
   * @param {*} schoolId
   */
  getVpadInternetList(schoolId) {
    return http.get(`/terminal/vpad/url/${schoolId}?status=1`)
  },
  /**
   * 修改或者添加网络访问白名单
   * @param {*} d
   */
  modifyInternetUrl(d) {
    return http.post('/terminal/vpad/url', d)
  },
  /**
   * 应用白名单
   * @param {*} schoolId
   */
  getVpadAppList(schoolId, status) {
    return http.get(`/terminal/vpad/app/${schoolId}`)
  },
  /**
   * 修改删除或者添加应用访问白名单
   * @param {*} d
   */
  modifyVpadApp(d) {
    return http.post('/terminal/vpad/app', d)
  },
  /**
   * 查询使用记录
   * @param {*} d
   */
  usageRecord(clientId) {
    return http.get(`/terminal/vpad/useRecord/${clientId}`)
  },
  /**
   * 查询应用设置桌面
   * @param {*} d
   */
  appSettings(schoolId) {
    return http.get(`/terminal/vpad/desktop/config/${schoolId}`)
  },
  /**
   * 查询应用设置切换选中状态
   * @param {*} d
   */
  cutState(d) {
    return http.post('/terminal/vpad/desktop/config', d)
  }
}
