import http from '@/utils/http'
export default {
  getVVRList(schoolId) {
    return http.get(`/terminal/vvr/list/places/${schoolId}`)
  },
  addVVR(d) {
    return http.post('/terminal/vvr/add', d)
  }
}
