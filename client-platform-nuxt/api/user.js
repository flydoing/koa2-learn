import request from '@/utils/request'

// const User = {}
// // 登录
// User.register = (postData) => {
//   return request({
//     method: 'post',
//     url: '/user/register',
//     data: postData
//   })
// }

// 注册
export function register (postData) {
  return request({
    method: 'post',
    url: '/user/register',
    data: postData
  })
}

// // 登录
// export function loginV2 (query) {
//   return request({
//     url: '/login/v2',
//     method: 'post',
//     data: query
//   })
// }

// // 短信验证码
// export function sendSms (query) {
//   console.dir(query)
//   return request({
//     url: '/sms/v1/sendSms',
//     method: 'get',
//     params: query
//   })
// }

// // 退出
// export function loginOut (query) {
//   return request({
//     url: '/login/v1/loginOut',
//     method: 'get',
//     params: query
//   })
// }
