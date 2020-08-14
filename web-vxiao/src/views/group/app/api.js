import http from '@/utils/http'

export default {
  loadAppAdmins(schoolId, appType, groupId = null) {
    let url = `/base/app/admin/${schoolId}/${appType}`
    if (groupId) {
      url = `${url}?groupId=${groupId}`
    }
    return http.get(url)
  },
  addAppAdmins(d) {
    return http.post('/base/app/admin', d)
  },
  /**
   * 拉取学校应用新建提示设置接口
   * @param  {[type]} schoolId [description]
   * @return {[type]}          [description]
   */
  getRemindSets(schoolId, appType) {
    return http.get(`/base/app/remindSets?schoolId=${schoolId}&appType=${appType}`)
  },
  /**
   * 修改学校应用新建提示设置接口
   *{
        "remindSets": {
            "schoolId": 14343,
            "appType": "1068",
            "period": 1
        }
    }
   */
  modifyRemindSets(d) {
    return http.post('/base/app/remindSets/modify', d)
  },
  /**
   * 获取群应用关系,触发生成提示消息接口(原有查人所在群app列表)
   * @param  {[type]} groupId [description]
   * @return {[type]}         [description]
   */
  getGroupApps(groupId) {
    return http.get(`/base/group/app/${groupId}`)
  }
}
