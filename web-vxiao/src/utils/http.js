import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import Check from './check'
/**
 * 默认http，配置
 * @type {[type]}
 */
const http = axios.create({
  timeout: 60000,
  withCredentials: false,
  headers: {
    post: {
      'Content-Type': 'application/json'
    },
    common: {
      // 'clientId': 'web',
      MFDate: new Date().getTime(),
      'MFUser-Agent': 'version=[MForce(1.0.0_12)/WebPortal (4.0)/encrypt]'
    }
  }
})

/**
 * 请求拦截器
 * @param  {[type]} (config [description]
 * @return {[type]}         [description]
 */
http.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = JSON.stringify(config.data)
    }
    return config
  },
  err => {
    return new Promise((resolve, reject) => {
      Message({ message: '错误的传参', type: 'error' })
      reject(err)
    })
  }
)

/**
 * 响应拦截器
 * @param  {[type]} (res) [description]
 * @return {[type]}       [description]
 */
http.interceptors.response.use(
  res => {
    const _res = res.data
    if (_res.code === '1' || _res.code === '27') {
      return _res
    }
    if (_res.code === '17') {
      store.dispatch('socketAction', { type: '6', content: _res.msg })
      return
    }
    // 若不是正确的返回code，且已经登录，就抛出错误
    if (!Check.isNullString(_res.msg)) {
      Message({ type: 'error', message: _res.msg })
    }
    return new Promise((resolve, reject) => {
      reject(_res)
    })
  },
  err => {
    const res = err.response
    switch (res.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '未授权，请登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        // err.message = `请求地址出错: ${err.response.config.url}`
        err.message = `请求地址出错`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '操作失败'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
    return new Promise((resolve, reject) => {
      Message({ type: 'error', message: err.message })
      reject(err)
    })
  }
)

export default http
