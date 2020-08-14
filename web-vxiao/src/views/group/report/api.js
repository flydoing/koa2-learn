import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'

export default {
  /**
   * 加载历史列表
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  loadReportList(groupId, appType, fromUserId = 0) {
    return http.get(`/report/business/history/${appType}/${groupId}?fromUserId=${fromUserId}`)
  },

  /**
   * 加载报表数据
   * @param  {[type]} groupId   [description]
   * @param  {[type]} appType   [description]
   * @param  {[type]} startDate [description]
   * @param  {[type]} endDate   [description]
   * @return {[type]}           [description]
   */
  loadReportData(options) {
    let url = `/report/business/${options.appType}/${options.groupId}`
    delete options.appType

    if (!options.hasOwnProperty('fromUserId')) {
      options.fromUserId = 0
    }
    let params = []
    C.forEachKeys(options, (k, v) => {
      if (!Check.isNullString(v)) {
        params.push(`${k}=${v}`)
      }
    })

    return http.get(`${url}?${params.join('&')}`)
  },

  /**
   * 加载tabs
   * @return {[type]} [description]
   */
  loadTabs(groupId, appType, templetId = '', level = '') {
    let url = `/report/business/templet/${groupId}/${appType}`
    if (templetId !== '' && level === '') {
      url = `${url}?templetId=${templetId}`
    }
    if (level !== '' && templetId === '') {
      url = `${url}?level=${level}`
    }
    if (level !== '' && templetId !== '') {
      url = `${url}?templetId=${templetId}&level=${level}`
    }
    return http.get(url)
  },
  /**
   * 加载学校创建的模板列表
   * @return {[type]} [description]
   */
  loadTemplates(groupId, appType) {
    return http.get(`/report/business/school/allocated/templets?groupId=${groupId}&appType=${appType}`)
  },
  /**
   * [loadTemplateList description]
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  loadTemplateList(groupId, appType) {
    return http.get(`/report/business/system/templets.json?groupId=${groupId}&appType=${appType}`)
  },
  /**
   * 拉取模板上的字段
   * @param  {[type]} appType    [description]
   * @param  {[type]} reportType [description]
   * @return {[type]}            [description]
   */
  loadTemplateField(appType, reportType) {
    return http.get(`/report/business/templet/fields.json?appType=${appType}&reportType=${reportType}`)
  },
  /**
   * 拉取预览数据
   * @param  {[type]} options.appType    [业务编号]
   * @param  {[type]} options.groupId    [群Id]
   * @param  {[type]} options.codes      [选取的字段]
   * @param  {Number} options.reportType [模板类型]
   * @return {[type]}                    [description]
   */
  loadTemplatePreview(appType, groupId, codes, reportType = 2) {
    return http.get(`/report/business/${appType}/${groupId}?codes=${codes}&reportType=${reportType}`)
  },
  /**
   * 拉取推送规则分类
   * @return {[type]} [description]
   */
  loadTemplateRule() {
    return http.get('/report/business/push/category')
  },

  /**
   * 添加新建模板
   * @param {[type]} d [description]
   */
  addTemplate(d) {
    return http.post('/report/business/school/templet/modify.json', d)
  },
  /**
   * 更新模板
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  modifyTemplate(d) {
    return http.post('/report/business/templet/modify', d)
  },

  /**
   * 加载时间列表
   * @return {[type]} [description]
   */
  loadTimes(groupId, appType, timeType, isSelfPeriod) {
    let url = `/report/business/history/periods/${appType}/${groupId}?timeType=${timeType}`
    if (isSelfPeriod) {
      url = `${url}&isSelfPeriod=${isSelfPeriod}`
    }
    return http.get(url)
  },
  /*
   * 消费退款
   */
  refundCommit(d) {
    return http.post('/business/cookbook/refund', d)
  },

  /**
   * 加载rest报表数据
   * @return {[type]} [description]
   */
  getRestReportData(params) {
    return http.post(`/rest/message/group/report`, params)
  }
}
