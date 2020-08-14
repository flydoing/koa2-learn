import http from '@/utils/http'
export default {
  /**
   * 加载分类
   * @param  {[type]} groupId [description]
   * @param  {[type]} appType [description]
   * @return {[type]}         [description]
   */
  loadTabs({ appType = 1203, groupId, startDate, endDate }) {
    return http.get(`/report/business/tab/${appType}/${groupId}?groupId=${groupId}&startDate=${startDate}&endDate=${endDate}`)
  },

  /**
   * 加载分类对应报表数据
   * @param  {Number} options.appType    [description]
   * @param  {[type]} options.groupId    [description]
   * @param  {[type]} options.reportType [description]
   * @param  {[type]} options.queryType  [description]
   * @return {[type]}                    [description]
   */
  loadReport({ appType = 1203, groupId, startDate, endDate, reportType, queryType }) {
    return http.get(`/report/business/${appType}/${groupId}?groupId=${groupId}&startDate=${startDate}&endDate=${endDate}&reportType=${reportType}&queryType=${queryType}`)
  },

  /**
   * 获取应用列表
   * @param  {[type]} groupId    [description]
   * @return {[type]}                    [description]
   */
  getApps(groupId, hasChildren, withUser) {
    let url = `/business/worksheet/setting/appcategory/list?groupId=${groupId}`
    if (hasChildren) {
      url = `${url}&hasChildren=1`
    }
    if (withUser) {
      url = `${url}&withUser=1`
    }
    return http.get(url)
  },

  /**
   * 获取学校列表
   * @param  {[type]} schoolId    [description]
   * @param  {[type]} keyword    [description]
   * @param  {[type]} page    [description]
   * @return {[type]}                    [description]
   */
  getSchools(schoolId, keyword, page) {
    return http.get(`/business/worksheet/query/client/list?schoolId=${schoolId}&name=${keyword}&currentPage=${page}`)
  },

  /**
   * 获取应用负责人列表
   * @param  {[type]} groupId    [description]
   * @param  {[type]} appId    [description]
   * @return {[type]}                    [description]
   */
  getAppUsers(groupId, appId) {
    return http.get(`/business/worksheet/query/responsible?groupId=${groupId}&appCategoryId=${appId}`)
  },

  /**
   * 修改应用负责人
   * @param  {[type]} data    [description]
   * @return {[type]}         [description]
   */
  modifyAppUsers(data) {
    return http.post(`/business/worksheet/setting/responsible`, data)
  },

  /**
   * 查询负责人表格数据
   * @param  {[type]} groupId    [description]
   * @return {[type]}         [description]
   */
  getHandlerTable(groupId) {
    return http.get(`/business/worksheet/query/responsible/table?groupId=${groupId}`)
  },

  /**
   * 获取应用负责人列表
   * @param  {[type]} groupId    [description]
   * @param  {[type]} appId    [description]
   * * @param  {[type]} terminalIds    [description]
   * @return {[type]}                    [description]
   */
  getAppUsersV2(groupId, appId, terminalIds) {
    return http.get(`/business/worksheet/query/responsible/V2?groupId=${groupId}&workSheetAppId=${appId}&clientTypeCategoryIds=${terminalIds}`)
  },

  /**
   * 修改应用负责人
   * @param  {[type]} data    [description]
   * @return {[type]}         [description]
   */
  modifyAppUsersV2(data) {
    return http.post(`/business/worksheet/setting/responsible/table`, data)
  }
}
