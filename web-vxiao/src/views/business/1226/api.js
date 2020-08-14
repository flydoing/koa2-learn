import http from '@/utils/http'
export default {
  /**
   * 获取vPost列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getvPosList(schoolId) {
    return http.get(`/terminal/vpos/${schoolId}`)
  },
  /**
   * 添加
   * @param {[type]} d [description]
   */
  addvPos(d) {
    return http.post('/terminal/vpos/bind', d)
  },
  /**
   * 更新
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyvPos(d) {
    return http.post('/terminal/vpos/modify', d)
  },
  /**
   * 删除解绑
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  unbindvPos(d) {
    return http.post('/terminal/vpos/unbind', d)
  },
  /**
   * 根据ID查找vPos详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getvPosById(id) {
    return http.get(`/terminal/vpos/detail/${id}`)
  },
  /**
   * vpos模式获取
   * 根据
   * @param  {[type]} 无 [description]
   * @return {[type]}    [description]
   */
  getvPosMode() {
    return http.get('/base/category/query.json?type=208')
  },

  /**
   * vpos开门权限人员获取
   * 根据
   * @param  {[type]} 无 [description]
   * @return {[type]}    [description]
   */
  getvPosDoorUsers() {
    return http.get('/base/category/query.json?type=209')
  }
}
