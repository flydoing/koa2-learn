import request from '@/utils/request'

// 获取文件上传token
export function fetchFileToken (query) {
  return request({
    url: '/file/v1/token',
    method: 'post',
    data: query
  })
}

// 获取app包下载信息
export function fetchAppDownloadInfo (query) {
  return request({
    url: '/download/v1/info',
    method: 'get',
    params: query
  })
}

// 上传外链图片
// query:{oldUrl:''}
export function downloadAndUploadImage (query) {
  return request({
    url: '/file/v1/downloadAndUploadNew',
    method: 'get',
    params: query
  })
}
