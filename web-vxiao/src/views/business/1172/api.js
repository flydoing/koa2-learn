import http from '@/utils/http'
export default {
  getOptions() {
    return http.get('/business/yearbook/query/option')
  },
  modifyOption(schoolId, option) {
    return http.post(`/business/yearbook/school/option/${schoolId}`, option)
  }
}
