import http from '@/utils/http'

export default {
  /**
   * 查询是否存在计划
   * @param  {[type]} groupId [description]
   * @param  {[type]} userId [description]
   * @param  {[type]} date [description]
   * @return {[type]}         [description]
   */
  checkWetherExistPlan(groupId, userId, date) {
    return http.get(`/business/crm/plan/check/isnew/${groupId}/${userId}/${date}`)
  }
}
