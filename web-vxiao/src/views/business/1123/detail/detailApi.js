import http from '@/utils/http'
import C from '@/utils/object'
export default {
  /**
   * 获取父tab
   * @param {主消息ID} msgId
   * @param {群主ID} groupId
   * @param {主消息ID} msgId
   */
  getMainTab({ appType, groupId, msgId, ...args }) {
    let url = `/report/business/tab/${appType}/${groupId}.json?msgId=${msgId}&`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },
  /**
   * 获取子tab
   * @param {appType} appType
   * @param {群主ID} groupId
   * @param {主消息ID} msgId
   * @param {查询关键字} queryType
   */
  getSubTat({ appType, groupId, msgId, queryType, ...args }) {
    let url = `/report/business/${appType}/${groupId}.json?msgId=${msgId}&queryType=${queryType}&`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },
  /**
   * 获取图表数据
   */
  getChartData(args) {
    let url = `/business/entranceexam/chart/data?`
    let params = {
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },
  /**
   * 学校空间 获取tab
   * @param {主消息ID} msgId
   * @param {群主ID} groupId
   */
  getSchoolTab(msgId, groupId) {
    return http.get(`/business/entranceexam/query/subjects.json?msgId=${msgId}&groupId=${groupId}`)
  },
  /**
   * 获取消息报表数据
   * @param {消息ID} msgId
   * @param {群主ID} groupId
   */
  getMessageReport(groupId, msgId) {
    return http.get(`/report/business/1123/${groupId}?msgId=${msgId}&noTempletReport=1`)
  }
}
