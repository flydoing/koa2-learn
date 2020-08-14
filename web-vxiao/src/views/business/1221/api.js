import http from '@/utils/http'
export default {
  /**
   * 根据学校id查询V储物柜信息接口
   * @param  {[type]} schoolId  [学校Id]
   * @param  {[type]} currentPage [页码]
   */
  loadStorages(schoolId, currentPage = 1) {
    return http.get(`/business/storage/query/box/${schoolId}?currentPage=${currentPage}`)
  },

  /**
   * 根据V柜id查询储物柜信息和分配情况接口
   * @param  {[type]} boxId [description]
   * @return {[type]}       [description]
   */
  loadStorageDetail(boxId) {
    return http.get(`/business/storage/query/box/allot/${boxId}`)
  },

  /**
   * 根据学校id查询班级储物柜分配信息接口
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadClassStorages(schoolId, currentPage = 1) {
    return http.get(`/business/storage/query/class/allot/${schoolId}?currentPage=${currentPage}`)
  },

  /**
   * 根据学校id查询班级储物柜分配信息接口
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadClassStorageDetial(groupId, currentPage = 1) {
    return http.get(`/business/storage/query/user/allot/${groupId}?currentPage=${currentPage}`)
  },

  /**
   * 根据储物柜设备号和卡号获取用户分配的箱子信息
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  loadUserStorage(d) {
    return http.post(`/business/storage/allot/user`, d)
  },

  /**
   * 移除储物柜
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  saveOrUpdateStorage(d) {
    return http.post('/business/storage/bind/device', d)
  },

  /**
   * 格子绑定用户
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  saveOrUpdateBox(d) {
    return http.post('/business/storage/allot/user', d)
  },

  /**
   * 协助开门设置
   * @param  {Number} isOpen [description]
   * @return {[type]}        [description]
   */
  saveAssistSet(schoolId, isOpen = 2) {
    return http.post(`/business/storage/isopen/${schoolId}`, { isOpen: isOpen })
  },

  /**
   * 拉取配置信息
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  loadAssistSet(schoolId) {
    return http.get(`/business/storage/query/isopen/${schoolId}`)
  },

  /**
   * /business/storage/query/14343
   * 【V柜】应用设置列表查询
   * @param  {[schoolId]} schoolId  [学校Id]
   */
  getStorages(schoolId = 14343) {
    return http.get(`/business/storage/query/${schoolId}`)
  },
  /**
   * /base/category/query.json?type=219
   * 获取储物柜类型:
   * @param  {[type]} type  [类型]
   */
  getCategorys(type = 219) {
    return http.get(`/base/category/query.json?type=${type}`)
  },
  /**
   * 【V柜】器材柜器材类型查询
   * /base/category/query?type=220&groupId={groupid}&isDefault=1
   */
  getCategorysEquipment(groupId, type = 220, isDefault = 1) {
    return http.get(`/base/category/query?type=${type}&groupId=${groupId}&isDefault=${isDefault}`)
  },
  /**
   * 【V柜】 添加器材柜 器材类型
   * /base/category/add###
   */
  addCategoryEquipment(categorys) {
    return http.post('/base/category/add###', categorys)
  },
  /**
   * 【V柜】 器材柜分配器材
   * /business/storage/equipmentTypeAllot
   */
  updateEquipmentTypeAllot(storageEquipmentAllot) {
    return http.post('/business/storage/equipmentTypeAllot', storageEquipmentAllot)
  },
  /**
   * 【V柜】 寄存柜设置为空
   * /business/storage/depositBoxSetNull
   */
  updateDepositBoxSetNull(storageDepositAllot) {
    return http.post('/business/storage/depositBoxSetNull', storageDepositAllot)
  }
}
