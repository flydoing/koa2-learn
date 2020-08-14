import http from '@/utils/http'

export default {
  complexSearch(groupId = '', keyword = '', currentPage = 1) {
    return http.get(`/base/group/complex/search?groupId=${groupId}&keyword=${keyword}&currentPage=${currentPage}`)
  }
}
