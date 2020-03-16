import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
import { getToken, removeToken, removeUserInfo } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api地址
  // baseURL: 'http://app.dev.gc.xf.io:7200', // api的base_url
  timeout: 15000, // request timeout
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Http-Async-Requested': 'HttpAsyncRequest'
  }

})
// request interceptor
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['user-token'] = getToken() // 让每个请求携带token
      // console.dir(config.headers)
    }
    return config
  }, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  function (response) {
    // dosomething
    const res = response.data
    // return res
    if (response.status === 200) {
      // console.log(res)
      // blob数据流
      if (response.config.responseType === 'blob') {
        return res
      }
      if (res.code === 200) {
        return res
      } else if (res.code === 500000) {
        Message({
          message: '系统出现了未知的错误，请联系管理员!',
          type: 'error',
          duration: 5 * 1000
        })
        // return false
        return Promise.reject(res)
      } else if (res.code === 500001) {
        const data = res.data
        const errArr = []
        for (const k in data) {
          errArr.push(data[k])
        }
        Message({
          message: errArr[0],
          type: 'error',
          duration: 5 * 1000
        })
        // return false
        return Promise.reject(res)
      } else if (res.code === 400023) {
        // 账号在其它设备登入
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        service({
          url: '/login/v1/loginOut',
          method: 'get'
          // params: query
        }).then(response => {
          removeToken()
          removeUserInfo()
          // 服务端跳转
          try {
            response.redirect('/user/login')
          } catch (e) {
          }
          // 客户端跳转
          try {
            window.location = '/user/login'
          } catch (e) {
          }
        })
        // window.location = '/user/login'
        /* store.dispatch('LogOut').then(() => {
          location.reload()
        }) */
        return false
      } else if (res.code === 403 || res.code === 500013) {
        // 登录超时或已退出登陆
        removeToken()
        removeUserInfo()
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        // 服务端跳转
        try {
          response.redirect('/user/login')
        } catch (e) {
        }
        // 客户端跳转
        try {
          window.location = '/user/login'
        } catch (e) {
        }

        return false
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        return res // 临时：需要显示返回的msg信息
        // return Promise.reject(res)
      }
    } else {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    }
  },
  error => {
    /* console.log('err：' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    }) */
    return Promise.reject(error)
  }
)

export default service
