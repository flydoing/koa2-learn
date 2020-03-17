import axios from 'axios'
import Vue from 'vue'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api地址
  baseURL: 'http://localhost:3001/v1', // api地址
  timeout: 8000, // request timeout
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Http-Async-Requested': 'HttpAsyncRequest'
  }

})
// request interceptor
service.interceptors.request.use(
  (config) => {
    return config
  }, (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  function (response) {
    // dosomething
    console.log('service.interceptors.response.use')
    console.log(response)
    const res = response.data
    // return res
    if (response.status === 200) {
      // console.log(res)
      // blob数据流
      if (response.config.responseType === 'blob') {
        return res
      }
      return res
      // if (res.code === 200) {
      //   return res
      // } else if (res.code === 500000) {
      //   Vue.prototype.$toastvant('系统出错')
      //   return Promise.reject(res)
      // } else {
      //   Vue.prototype.$toastvant('系统出错：' + res.msg)
      //   return Promise.reject(res)
      // }
    } else {
      Vue.prototype.$toastvant('系统出错:' + response.status)
      return Promise.reject(res)
    }
  },
  (error) => {
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
