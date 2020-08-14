import http from '@/utils/http'
export default {
  /**
   * 新建报名
   * @param  {[type]} d [新建请求体]
   */
  create(d) {
    return http.post('/business/message/add', {
      message: d
    })
  },
  /**
   * 拉取报名表格
   * @param  {[type]} msgId [消息id]
   * @param  {[type]} serialNumber [序列号]
   * @param  {[type]} userId [用户id]
   */
  // queryTable(msgId, userId, serialNumber, userName) {
  //   let axios = {}
  //   if (userId) {
  //     axios = http.get(`/business/activity/detail/${msgId}?userId=${userId}`)
  //   } else if (serialNumber) {
  //     axios = http.get(`/business/activity/detail/${msgId}?serialNumber=${serialNumber}&name=${userName}`)
  //   } else {
  //     axios = http.get(`/business/activity/detail/${msgId}`)
  //   }
  //   return axios
  // },
  queryTable(msgId, userId, mobile, vcode, serialNumber, userName) {
    let axios = {}
    if (userId) {
      axios = http.get(`/business/activity/detail/${msgId}?userId=${userId}`)
    } else if (mobile) {
      axios = http.get(`/business/activity/detail/${msgId}?mobile=${mobile}&vcode=${vcode}`)
    } else if (serialNumber) {
      axios = http.get(`/business/activity/detail/${msgId}?serialNumber=${serialNumber}&name=${userName}`)
    } else {
      axios = http.get(`/business/activity/detail/${msgId}`)
    }
    return axios
  },
  /**
   * 提交申请表
   * @param  {[type]} enroll [表格信息内容]
   */
  commitTable(d) {
    return http.post('/business/activity/submit/enroll', d)
  },
  /**
   * 拉取参与情况
   * @param  {[type]} msgId [消息id]
   */
  querySummary(msgId) {
    return http.get(`/business/activity/participant/summary?msgId=${msgId}`)
  },
  /**
   * 拉取报名人列表
   * @param  {[type]} msgId [消息id]
   * @param  {[type]} type [审核状态]
   * @param  {[type]} currentPage [分页页码]
   */
  queryApplycantList(msgId, type, currentPage) {
    return http.get(`/business/activity/participant/list`)
  },
  /**
   * 拉取基础信息
   * @param  {[type]} type [目录类型]
   */
  queryBaseInfo(type = 173) {
    return http.get(`/base/category/query?type=${type}`)
  },
  /**
   * 拉取可见范围(学校空间)
   * @param  {[type]} sid [学校id]
   */
  querySchoolVisibleRange(sid) {
    return http.get(`/base/school/group/${sid}.json`)
  },
  /**
   * 拉取基本设置信息列表
   * @param  {[type]} schoolId [学校id]
   */
  querySetInfoList(schoolId) {
    return http.get(`/business/activity/setting/baseInfo/list?schoolId=${schoolId}`)
  },
  /**
   * 拉取某一条消息
   * @param msgId [学校id]
   */
  loadOnceMessage(msgId) {
    return http.get(`/business/message/query/detail/${msgId}`)
  },
  /**
   * 创建者  审核
   */
  audit(d) {
    return http.post('/business/activity/participant/audit', d)
  },
  /**
   * 获取某条消息详情
   * @param {消息Id} msgId
   */
  getTheMsg(msgId) {
    return http.get(`/business/message/query/detail/${msgId}`)
  },
  /**
   * 获取审核类型列表
   * @param {主消息Id} msgId
   */
  getCheckStyleList(msgId) {
    return http.get(`/business/activity/participant/summary?msgId=${msgId}`)
  },
  /**
   * 获取申请人列表
   * @param {主消息ID} msgId
   * @param {搜索关键字} name
   */
  getApplycantList(msgId, name = '', page = 1, type = '') {
    let url = `/business/activity/participant/list?msgId=${msgId}&currentPage=${page}`
    if (name) {
      url = `${url}&name=${name}`
    }
    if (type) {
      url = `${url}&type=${type}`
    }
    return http.get(url)
  },
  /**
   * 获取用户所在的所有群
   */
  getGroups(groupId) {
    return http.get(`/base/school/group/${groupId}`)
  },
  /**
   * 获取当前群的用户
   * @param {群主ID} groupId
   */
  getCurrentGroupUsers(groupId) {
    return http.get(`/base/group/account/${groupId}`)
  },
  getApplyInfoList(schoolId) {
    return http.get(`/business/activity/setting/baseInfo/list?schoolId=${schoolId}`)
  },
  modifyBaseInfo(d) {
    return http.post('/business/activity/setting/baseInfo', d)
  },
  /**
   * 获取手机验证吗
   * @param {手机好吗} mobile
   */
  getCode(mobile) {
    return http.get(`/base/aas/vcode/${mobile}`)
  }
}
