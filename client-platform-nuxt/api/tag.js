import request from '@/utils/request'

// 名字模糊搜索标签:标签组件 tag-select.vue
export function searchTagByName (query) {
  return request({
    url: '/tag/v1/search',
    method: 'post',
    data: query
  })
}

// 获取标签列表
export function fetchTag (query) {
  return request({
    url: '/tag/v1/search',
    method: 'post',
    data: query
  })
}
// 获取常用标签
export function fetchUsualTag (query) {
  return request({
    url: '/tag/v1/usualTag',
    method: 'post',
    data: query
  })
}

// 新建标签
export function createTag (query) {
  return request({
    url: '/tag/v1/add',
    method: 'post',
    data: query
  })
}

// 更新标签
export function updateTag (query) {
  return request({
    url: '/tag/v1/update',
    method: 'post',
    data: query
  })
}

// 修改标签状态
export function updateTagStatus (query) {
  return request({
    url: '/tag/v1/status',
    method: 'post',
    data: query
  })
}

// 标签分类:在category.js里引用 /category/v1/findTree
// 用户群分类查询：/flock/v1/all
export function fetchFlockAll (query) {
  return request({
    url: '/flock/v1/all',
    method: 'get',
    params: query
  })
}

// 批量上传标签excel,请求写在页面上

// 标签审核
export function fetchTagAudit (query) {
  return request({
    url: '/tag/v1/applyList',
    method: 'post',
    data: query
  })
}

// 清空指定审核词:备注，此处的post用params
export function clearTagAudit (query) {
  return request({
    url: '/tag/v1/applyList/clear',
    method: 'post',
    params: query
  })
}
