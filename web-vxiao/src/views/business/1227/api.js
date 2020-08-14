import http from '@/utils/http'
export default {
  /**
   * 获取vBoxt列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getvBoxList(schoolId) {
    return http.get(`/terminal/vbox/list/${schoolId}`)
  },
  /**
   * 添加
   * @param {[type]} d [description]
   */
  addvBox(d) {
    return http.post('/terminal/vbox/add', d)
  },
  /**
   * 更新
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyvBox(d) {
    return http.post('/terminal/vbox/modify', d)
  },
  /**
   * 删除解绑
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  unbindvBox(d) {
    return http.post('/terminal/vbox/delete', d)
  },
  /**
   * 根据ID查找vBox详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getvBoxById(id) {
    return http.get(`/terminal/vbox/${id}`)
  }
}
