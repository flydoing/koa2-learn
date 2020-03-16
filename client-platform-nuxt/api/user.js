import request from '@/utils/request'

// 文章详情/article/v1/detail
export function fetchArticleDetail (query) {
  return request({
    url: '/article/v1/detail',
    method: 'get',
    params: query
  })
}

// 获取我的文章列表
export function fetchMyArticles (query) {
  return request({
    url: '/article/v1/fetchMyArticles',
    method: 'post',
    data: query
  })
}

// 删除文章
export function deleteMyArticle (query) {
  return request({
    url: '/article/v1/deleteMyArticle',
    method: 'get',
    params: query
  })
}

/* --------------
* === 马甲用户Api ===
--------------- */
export function fetchUser (query) {
  return request({
    url: '/user/v1/getUser',
    method: 'post',
    data: query
  })
}

export function searchUser (query) {
  return request({
    url: '/user/v1/searchUser',
    method: 'post',
    data: query
  })
}

/* --------------
* === app用户Api ===
--------------- */
// 搜索用户
// query:{nickname:''}
export function searchAppUser (query) {
  return request({
    url: '/appUser/v1/findByNickname/like',
    method: 'get',
    params: query
  })
}

// 搜索官方App用户
// query:{nickname:''}
export function searchOfficialAppUser (query) {
  return request({
    url: '/appUser/v1/findOfficialUser/like',
    method: 'post',
    data: query
  })
}

// 用户群接口
// query:{nickname:''}
export function fatchUserGroup (query) {
  return request({
    url: '/flock/v1/all',
    method: 'get',
    params: query
  })
}

// 获取我关注的用户
// query:{basePageVo:{page: 1,pageSize: 10}}
export function fatchFollowUser (query) {
  return request({
    url: '/user/v1/followingList',
    method: 'post',
    data: query
  })
}
