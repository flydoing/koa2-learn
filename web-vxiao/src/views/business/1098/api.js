import http from '@/utils/http'

export default {
  /**
   * 加载签到签退记录列表
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getSigns(groupId, appType) {
    return http.get(`/business/crm/visit/datas?groupId=${groupId}&crmAppType=${appType}`)
  }
}
