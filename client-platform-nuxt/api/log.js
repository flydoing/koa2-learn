import request from '@/utils/request'

// 日志打点
export function logBatchReport (query) {
  return request({
    url: '/log/batchReport',
    method: 'post',
    data: query
  })
}
