import http from '@/utils/http'
export default {
  parseTemplate(schoolId, fileId) {
    return http.get(`/business/vcard/import/detail/${schoolId}?fileId=${fileId}`)
  },
  modifyConsume(data) {
    return http.post(`/business/vcard/modify/record`, data)
  }
}
