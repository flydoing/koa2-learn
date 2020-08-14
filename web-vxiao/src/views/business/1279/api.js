import http from '@/utils/http'
export default {
  addVisionPlace(d) {
    return http.post(`/terminal/vision/place/add`, d)
  },
  getVisionPlaces(schoolId) {
    return http.get(`/terminal/vision/place/${schoolId}`)
  },
  getVisionPlaceDetail(placeId) {
    return http.get(`/terminal/vision/place/detail?placeId=${placeId}`)
  },
  getVisionProtocolaccount(groupId) {
    return http.get(`/terminal/vision/protocolaccount/${groupId}`)
  },
  addProtocolaccount(d) {
    return http.post(`/terminal/vision/protocolaccount/add`, d)
  },
  getRecodeList(currentPage = 1) {
    return http.get(`/business/streaming/footage/list.json?currentPage=${currentPage}`)
  }
}
