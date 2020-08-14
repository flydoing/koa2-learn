import http from '@/utils/http'
import C from '@/utils/object'

export default {

  /**
   * 加载柱状图
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadBarData({ groupId, ...args }) {
    let url = `/business/subjectevaluation/user/graph.json?groupId=${groupId}&`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },

  /**
   * 加载雷达图
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  loadRadarData({ groupId, ...args }) {
    let url = `/business/subjectevaluation/user/radar.json?groupId=${groupId}&`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },

  /**
   * 加载学科评价详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  loadSubjectApslDetail(msgId) {
    return http.get(`/business/subjectevaluation/detail.json?msgId=${msgId}`)
  }
}
