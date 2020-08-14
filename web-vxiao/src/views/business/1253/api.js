import http from '@/utils/http'
export default {
  loadApps(schoolId, type) {
    let url = `/report/business/bigData/sets/query?schoolId=${schoolId}`
    if (type) {
      url = `${url}&type=${type}`
    }
    return http.get(url)
  },
  modifyApps(d) {
    return http.post(`/report/business/bigData/sets/modify`, d)
  }
}
