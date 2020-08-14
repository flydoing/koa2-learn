import http from '@/utils/http'
import C from '@/utils/object'
export default {
  loadCatalog(groupId, range) {
    return http.get(`/business/course/query/chapter/${groupId}.json?range=${range}&isCount=1&isGlobal=1&isSerial=1`)
  },
  loadCards({ groupId, currentPage = 1, ...args }) {
    let url = `/business/resource/courseresource/query.json?groupId=${groupId}&currentPage=${currentPage}&`
    let params = {
      groupId: groupId,
      ...args
    }
    C.forEachKeys(params, (k, v) => {
      url = `${url}${k}=${v}&`
    })
    return http.get(url)
  },
  Publish(d) {
    return http.post('/business/resource/courseresource/publish.json', d)
  }
}
