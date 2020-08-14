import http from '@/utils/http'
export default {
  /**
   * 获取方案列表
   * @param  {[type]} schoolId [description]
   * @return {[type]}         [description]
   */
  getCases(schoolId) {
    return http.get(`/business/admission/form/list/${schoolId}`)
  },

  /**
   * 获取方案详情
   * @param  {[type]} formId [description]
   * @param  {[type]} msgId [description]
   * @param  {[type]} personNo [description]
   * @return {[type]}         [description]
   */
  getCaseDetail(formId, msgId, personNo) {
    let url = `/business/admission/form/detail`
    if (formId) {
      url = `${url}?formId=${formId}`
    } else if (msgId) {
      url = `${url}?msgId=${msgId}`
    }
    if (personNo) {
      url = `${url}&personNo=${personNo}`
    }
    return http.get(url)
  },

  /**
   * 编辑方案
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyCase(data) {
    return http.post(`/business/admission/form/add`, data)
  },

  /**
   * 获取审核类型及人数
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  getTypes(msgId) {
    return http.get(`/business/admission/participants/summary/${msgId}`)
  },

  /**
   * 获取审核类型及人数
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  getMembers(msgId, type, sortBy, page, keyword) {
    return http.get(`/business/admission/participants/query/${msgId}?type=${type}&sortBy=${sortBy}&currentPage=${page}&keyword=${keyword}`)
  },

  /**
   * 获取评估tabs
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  getTabs(msgId) {
    return http.get(`/business/admission/assign/list/tab/${msgId}`)
  },

  /**
   * 获取评估分组类型
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  getAppraiseType(msgId) {
    return http.get(`/business/admission/assign/list/group/${msgId}`)
  },

  /**
   * 获取评估分组类型
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  getAppraiseUsers(msgId, type, groupBy) {
    let url = `/business/admission/assign/list/${msgId}`
    if (type && groupBy) {
      url = `${url}?type=${type}&groupBy=${groupBy}`
    } else if (type) {
      url = `${url}?type=${type}`
    } else if (groupBy) {
      url = `${url}?groupBy=${groupBy}`
    }
    return http.get(url)
  },

  /**
   * 获取评估详情
   * @param  {[type]} msgId [description]
   * @param  {[type]} personNo [description]
   * @param  {[type]} formId [description]
   * @return {[type]}         [description]
   */
  getAppraiseDetail(msgId, personNo, formId) {
    let url = `/business/admission/evaluate/form/${msgId}/${personNo}`
    if (formId) {
      url = `${url}?formId=${formId}`
    }
    return http.get(url)
  },

  /**
   * 编辑评估结果
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyAppraise(data) {
    return http.post(`/business/admission/evaluate/submit`, data)
  },

  /**
   * 审核
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyAudit(data) {
    return http.post(`/business/admission/audit`, data)
  },

  /**
   * 获取志愿列表
   * @param  {[type]} msgId [description]
   * @return {[type]}         [description]
   */
  getAspirations(msgId, personNo) {
    let url = `/business/admission/aspiration/options/${msgId}`
    if (personNo) {
      url = `${url}?personNo=${personNo}`
    }
    return http.get(url)
  },

  /**
   * 修改分配
   * @param  {[type]} data [description]
   * @return {[type]}         [description]
   */
  modifyDistribution(data) {
    return http.post(`/business/admission/assign/submit`, data)
  }
}
