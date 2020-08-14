import http from '@/utils/http'
export default {
  /**
   * 拉取导入历史
   * @Author   clz
   * @DateTime 2018-09-06
   * @param    {[type]}   groupId
   * @param    {[type]}   userId
   * @return   {[type]}
   */
  loadImportHistory(groupId, userId) {
    return http.get(`/rest/school/getGroupImportHistory/${groupId}/${userId}`)
  },
  /**
   * 导入群用户
   * @Author   clz
   * @DateTime 2018-09-06
   * @param    {[type]}   groupId
   * @param    {[type]}   userId
   * @param    {[type]}   fileId
   * @return   {[type]}
   */
  importGroupUser(groupId, userId, fileId) {
    return http.get(`/rest/school/importGroupUserByFileId/${groupId}/${userId}/${fileId}`)
  },

  /**
   * 获取导入进度
   * @Author   clz
   * @DateTime 2018-09-06
   * @param    {[type]}   importDataId
   * @return   {[type]}
   */
  loadImportProgress(importDataId) {
    return http.get(`/rest/school/getImportUserProcess/${importDataId}`)
  }
}
