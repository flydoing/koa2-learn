import request from '@/utils/request'

export function fetchArticle (query) {
  return request({
    url: '/article/v1/search',
    method: 'post',
    data: query
  })
}

// 获取文章详情
export function fetchArticleDetail (query) {
  console.dir(query)
  return request({
    url: '/article/v1/detail',
    method: 'get',
    params: query
  })
}

// 新增或更新文章
export function createOrUpdateArticle (query) {
  return request({
    url: '/article/v1/richPublish',
    method: 'post',
    data: query
  })
}

/* 新增短文章
query:{
  content: 'string',
  cover: 'string',
  images: [{'height': 0,'imageUrl': 'string','width': 0}],
  video: 'string',
  tagIds: [1]
}
*/
export function createShortArticle (query) {
  return request({
    url: '/article/v1/shortPublish',
    method: 'post',
    data: query
  })
}

// 搜索话题
export function searchTopic (query) {
  return request({
    url: '/topic/v1/search',
    method: 'post',
    data: query
  })
}
// 获取推荐话题
export function fetchRecommendTopic (query) {
  return request({
    url: '/topic/v1/recommendTopic',
    method: 'get',
    data: query
  })
}
