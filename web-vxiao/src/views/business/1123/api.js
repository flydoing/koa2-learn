import http from '@/utils/http'
import C from '@/utils/object'
import Check from '@/utils/check'
export default {
  /**
   * 拉取应用设置 年级列表
   * @param {*} groupId
   */
  loadGrades(groupId) {
    return http.get(`/business/entranceexam/setting/query/grades.json?groupId=${groupId}`)
  },
  loadSettingDetail(grade, groupId, isDefault) {
    let url = `/business/entranceexam/setting/query/detail.json?grade=${grade}&groupId=${groupId}`
    if (isDefault) {
      url = `${url}&isDefault=${isDefault}`
    }
    return http.get(url)
  },
  addSetting(d) {
    return http.post('/business/entranceexam/setting/add.json', d)
  },
  parseExcel(data) {
    return http.post(`/business/entranceexam/save/tables/v2`, data)
  },
  verifyTables(d) {
    return http.post('/business/entranceexam/verify/tables.json', d)
  },
  submitTables(d) {
    return http.post('/business/entranceexam/save/tables.json', d)
  },
  loadReportData(appType, groupId, options) {
    let url = `/report/business/${appType}/${groupId}`
    let params = []
    C.forEachKeys(options, (k, v) => {
      if (!Check.isNullString(v)) {
        params.push(`${k}=${v}`)
      }
    })
    return http.get(`${url}?${params.join('&')}`)
  },
  loadReportTabs(appType, groupId, options) {
    let url = `/report/business/tab/${appType}/${groupId}`
    let params = []
    C.forEachKeys(options, (k, v) => {
      if (!Check.isNullString(v)) {
        params.push(`${k}=${v}`)
      }
    })
    return http.get(`${url}?${params.join('&')}`)
  },
  getSubjects(groupId, ids) {
    return http.get(`/business/course/subjectcategory/query?groupId=${groupId}&categoryIds=${ids}`)
  },
  saveSubjectRelation(data) {
    return http.post(`/business/course/subjectcategory/addRelation`, data)
  },
  getClasses(msgId) {
    return http.get(`/business/entranceexam/separate/class/${msgId}`)
  }
}
