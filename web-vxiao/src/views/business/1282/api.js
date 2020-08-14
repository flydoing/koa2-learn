import http from '@/utils/http'
export default {
  getRoadgates(schoolId) {
    return http.get(`/terminal/vroadgate/${schoolId}`)
  },
  addRoadgate(d) {
    return http.post('/terminal/vroadgate/bind', d)
  },
  modifyRoadgate(d) {
    return http.post('/terminal/vroadgate/modify', d)
  },
  unbind(d) {
    return http.post('/terminal/vroadgate/unbind', d)
  },
  restart(vroadGateBindId) {
    return http.get(`/terminal/vroadgate/publish/${vroadGateBindId}?actionType=2`)
  },
  removeRoadgate(id) {
    return http.get(`/terminal/vroadgate/delete/${id}`, id)
  },
  getRoadgateTabs(groupId, categoryId) {
    return http.get(`/report/business/tab/1282/${groupId}?categoryId=${categoryId}`)
  },
  getRoadgateRule(schoolId, categoryId) {
    return http.get(`/terminal/vroadgate/vRoadGateManager/list/${schoolId}/${categoryId}`)
  },
  addRoadgateRule(d) {
    return http.post(`/terminal/vroadgate/VRoadGateManager/add`, d)
  }
}
