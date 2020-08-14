import http from '@/utils/http'
import C from '@/utils/object'
export default {
  /**
   * 获取评课消息列表
   * @param {群主ID} groupId
   * @param {主消息ID} msgId
   */
  loadCommentMsg(groupId, msgId, currentPage = 1) {
    return http.get(`/business/message/query/${groupId}?queryType=parentId&parentId=${msgId}&type=107301&currentPage=${currentPage}`)
  },
  /**
   * 校级 应用设置 ip绑定班级列表
   */
  getClassroomIplist(schoolId) {
    return http.get(`/business/classroom/place/list?schoolId=${schoolId}`)
  },
  setIpAddress(d) {
    return http.post('/business/classroom/place/set', d)
  },
  getResourceCatalogues({ groupId, ...args }) {
    // return http.get(`/business/course/query/chapter/${groupId}.json?range=${range}&extension=1073&isCount=1&isGlobal=1&isSerial=1`)
    let url = `/business/course/query/chapter/${groupId}.json?`
    let params = {
      groupId,
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },
  getResourceDetail1({ groupId, ...args }) {
    let url = '/business/resource/courseresource/query.json?'
    let params = {
      groupId: groupId,
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },
  getResourceDetail2(categoryId, queryType, range, currentPage) {
    return http.get(`/business/praxis/query?categoryId=${categoryId}&isFirst=1&queryType=${queryType}&range=${range}&currentPage=${currentPage}`)
  },
  getResourceDetail3(groupId, type, categoryId, currentPage) {
    return http.get(`/business/message/query/${groupId}?type=${type}&categoryId=${categoryId}&queryType=category&currentPage=${currentPage}`)
  },
  getResourceDetail4(chapterId, range, currentPage) {
    return http.get(`/business/resource/query.json?chapterId=${chapterId}&range=${range}&type=down&currentPage=${currentPage}`)
  },
  getClassRoomTemplates(groupId, appType, userId, currentPage) {
    return http.get(`/business/course/query/template/list/${groupId}.json?appType=${appType}&userId=${userId}&currentPage=${currentPage}`)
  },
  pptTOImages(fileIds) {
    return http.get(`/business/classroom/query/convert/picture.json?fileIds=${fileIds}`)
  },
  getClassSetting(userId, metaType) {
    return http.get(`/business/classroom/metaData/query?userId=${userId}&metaType=${metaType}`)
  }
}
