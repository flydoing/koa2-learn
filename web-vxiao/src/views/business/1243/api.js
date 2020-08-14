import http from '@/utils/http'
export default {
  /**
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupsVCards(groupId) {
    return http.get(`/business/vcard/school/class/${groupId}`)
  },
  /**
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getVCardDetail(groupId) {
    return http.get(`/terminal/answercard/list/${groupId}`)
  },
  /**
   * 新增评比卡
   * @param {[type]} d [description]
   */
  addVCard(d) {
    return http.post('/terminal/answercard/bind', d)
  },
  /**
   * 删除评比卡
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  removeVCard(d) {
    return http.post(`/business/vcard/delCard`, d)
  },
  /**
   * 批量导入
   * @param  {[type]} schoolId [description]
   * @param  {[type]} userId   [description]
   * @param  {[type]} fileId   [description]
   * @return {[type]}          [description]
   */
  batchUpload(schoolId, userId, fileId, ignoreErrors = 1) {
    return http.get(`/terminal/answercard/import?schoolId=${schoolId}&userId=${userId}&fileId=${fileId}&ignoreErrors=${ignoreErrors}`)
  }
}
