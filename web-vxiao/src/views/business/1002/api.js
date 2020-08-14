import http from '@//utils/http'
export default {
  /**
   * 线下发布作业 拉取学生列表
   * @param {[type]} msgId [消息Id]
   */
  loadStudentList(msgId) {
    return http.get(`/business/homework/student/list/${msgId}.json`)
  },

  /**
   * 线下作业 家长发布作业成绩
   * @param {[type]} d [学生作业成绩]
   */
  parentCommitGrade(d) {
    return http.post('/business/homework/parent/rating.json', {
      homeworks: [d]
    })
  },

  /**
   * 线下作业 老师发布作业成绩
   * @param {[type]} d [学生作业成绩]
   */
  teacherCommitGrade(d) {
    return http.post('/business/homework/score/create.json', {
      homeworks: [d]
    })
  },

  /**
   * 线下作业 查看作业成绩
   * @param {[type]} userId [当前用户id]
   */
  getGradeTable(msgId, userId) {
    return http.get(`/business/homework/detail.json?msgId=${msgId}&userId=${userId}`)
  },
  /**
   * 拉取作业子消息列表（在线作业）
   * @param {groupId} gid 
   * @param {parentId} pid 
   * @param {appType} appType 
   * @param {页码} page 
   */
  getHomeworkChildMsg(gid, pid, appType, page = 1) {
    return http.get(`/business/message/query/${gid}?queryType=parentId&parentId=${pid}&type=${appType}&currentPage=${page}`)
  },
  /**
   * 提交在线作业
   */
  commitOnlineHomework(d) {
    return http.post('/business/message/add', d)
  },
  /**
   * 拉取某一条消息
   * @param {消息Id} msgId 
   */
  getTheMsg(msgId) {
    return http.get(`/business/message/query/detail/${msgId}`)
  },
  /**
   * 获取评分方式
   * @param {学校groupId} sgid 
   * @param {appType} appType 
   */
  getScoreType(sgid, appType) {
    return http.get(`/business/homework/settings?groupId=${sgid}&appType=${appType}`)
  },
  /**
   * 获取评价方式子类型
   * @param {categoryType} type 
   * @param {主消息Id} parentId 
   * @param {过滤条件} isDefault 
   */
  getScoreTypeChild(type, parentId, isDefault = '0') {
    return http.get(`/base/category/query?type=${type}&parentId=${parentId}&isDefault=${isDefault}`)
  },
  /**
   * 获取学生作业成绩列表
   * @param {*} groupId 
   * @param {*} msgId 
   * @param {区分展示与编辑} range 1-->展示  2-->编辑 
   */
  getStudentScoreList(groupId, msgId, range) {
    return http.get(`/business/homework/query/scorelist.json?groupId=${groupId}&msgId=${msgId}&range=${range}`)
  },
  /**
   * 获取家长在同一个班的孩子列表
   * @param {groupId} gid 
   */
  getChilrenList(gid) {
    return http.get(`/base/group/user/children/${gid}`)
  }
}
