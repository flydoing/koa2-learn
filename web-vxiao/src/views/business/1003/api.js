import http from '@//utils/http'
export default {
  /**
   * 获取成绩详情数据
   * @param {groupId} gid 
   * @param {消息ID} msgId 
   */
  getTableDetail(gid, msgId) {
    return http.get(`/business/reportcard/detail/data/${gid}/${msgId}`)
  },
  importResult(groupId, fileId) {
    return http.get(`/business/reportcard/readSheets.json?groupId=${groupId}&fileId=${fileId}`)
  }
}
