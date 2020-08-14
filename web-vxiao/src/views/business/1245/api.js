import http from '@/utils/http'
export default {
  /**
   * 获取勋章维度
   * @author zcy
   * @date 2018-05-23
   * @param {*} groupId
   */
  getDimensions(groupId) {
    return http.get(`/business/garden/settings/${groupId}`)
  },
  /**
   *
   * 保存维度设置
   * @author zcy
   * @date 2018-05-23
   * @param {*} d
   */
  saveDimesionSets(d) {
    return http.post('/business/garden/settings/add', d)
  }
}
