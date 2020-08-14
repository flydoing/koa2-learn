import http from '@/utils/http'
export default {
  getUrlDetail(url) {
    return http.get(`/commons/file/html.json?url=${url}`)
  },
  getPushList(courseGroupId, groupId) {
    return http.get(`/business/reading/query/${courseGroupId}?classId=${groupId}`)
  },
  getPushCardDetail(id) {
    return http.get(`/business/reading/query/detail/${id}`)
  }
}
