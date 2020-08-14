import http from '@/utils/http'
export default {
  /**
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupsVCards(groupId) {
    return http.get(`/base/school/group/${groupId}`)
  },
  /**
   * 获取评比卡 列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getVCardDetail(groupId, schoolId) {
    return http.get(`/business/vcard/detail/group/${groupId}?schoolId=${schoolId}`)
  },
  /**
   * 添加日常评比卡
   * @param {[type]} d [description]
   */
  addRatingVCard(d) {
    return http.post('/business/vcard/addRatingCard', d)
  },
  /**
   * 新增评比卡
   * @param {[type]} d [description]
   */
  addVCard(d) {
    return http.post('/business/vcard/bind', d)
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
  batchUpload(schoolId, userId, fileId) {
    return http.post(`/rest/vscreen/importCardByFileId/${schoolId}/${userId}/${fileId}`)
  },
  /**
   * 换卡
   * @Author   clz
   * @DateTime 2018-09-12
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  transferVCard(d) {
    return http.post('/business/vcard/transfer', d)
  },
  /**
   * 充值
   * @Author   clz
   * @DateTime 2018-09-12
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  rechargeVCard(d) {
    return http.post('/business/vcard/recharge', d)
  },
  /**
   * 消费设置列表
   * @Author   clz
   * @DateTime 2018-09-13
   * @param    {[type]}   schoolId [description]
   * @return   {[type]}            [description]
   */
  loadConsume(schoolId) {
    return http.get(`/business/consume/settings/list?schoolId=${schoolId}`)
  },
  /**
   * 修改消费限额
   * @Author   clz
   * @DateTime 2018-09-13
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  modifyConsume(d) {
    return http.post('/business/consume/settings/modify', d)
  },
  /**
   * 冻结，解冻
   * @Author   clz
   * @DateTime 2018-09-21
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  modifyLock(d) {
    return http.post('/business/vcard/lockCard', d)
  },

  /**
   * 提现
   * @Author   zcy
   * @DateTime 2019-6-11
   * @param    {[type]}   d [description]
   * @return   {[type]}     [description]
   */
  commitWithdraw(d) {
    return http.post('/business/vcard/cashCard', d)
  }
}
