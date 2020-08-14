import http from '@/utils/http'
export default {
  /**
   * 加载相册
   * @return {[type]} [description]
   */
  loadAlbums(groupId, pageIndex) {
    return http.get(`/base/media/query/picture/${groupId}?currentPage=${pageIndex}`)
  }
}
