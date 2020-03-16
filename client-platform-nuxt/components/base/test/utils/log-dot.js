import { getBrowserInfo, getOSInfo, param2Obj } from '@/utils/index'
import { getUserInfo } from '@/utils/auth'
// import { logBatchReport } from '@/api/log'

// 日志打点类
export class LogDot {
  constructor (config) {
    const query = param2Obj()
    const LogConfig = {
      host: process.env.LOG_DOT.host,
      appId: process.env.LOG_DOT.appId,
      appSec: process.env.LOG_DOT.appSec,
      c: query.channel || 'A_01', // 渠道ID
      sc: query.sc || '', // 子渠道号
      extc: document.referrer, // 扩展渠道，使用referrer
      appv: 'v1.0.0', // App版本，不能为空
      uid: '' // 用户id
    }
    if (config) {
      window.Object.assign(LogConfig, config)
    }
    const loggerFactory = new window.LoggerFactory(LogConfig.appId, LogConfig.appSec, LogConfig.host)
    loggerFactory.setC(LogConfig.c)
    loggerFactory.setSc(LogConfig.sc)
    loggerFactory.setExtc(LogConfig.extc)
    loggerFactory.setAppv(LogConfig.appv)
    loggerFactory.setUid(LogConfig.uid)
    this.loggerFactory = loggerFactory
  }

  // 事件上报接口
  eventLog (data, callback) {
    /* if (document.URL.indexOf('http://localhost') !== -1) {
    console.log('本地打点忽略')
    return false
    } */
    const logger = this.loggerFactory.getLogger('event')
    if (!data.action) {
      console.log('action is null!')
      return false
    }
    for (let key in data) {
      const val = data[key]
      if (typeof (val) === 'number') {
        logger.putNumber(key, val)
      } else {
        logger.putString(key, val)
      }
    }
    logger.send().then(function (res) {
      // console.log('log success')
      // 打点回调
      if (typeof (callback) === 'function') {
        callback(res)
      }
      // console.log(res)
    }).catch(function (status) {
      console.log('logErr:' + status)
      if (typeof (callback) === 'function') {
        callback()
      }
    })
  }
}

// 旧版获取日志打点信息
export function getLogInfo () {
  if (process.server) {
    return false
  }
  const MobileDetect = require('mobile-detect')
  const md = new MobileDetect(window.navigator.userAgent)
  let osName = md.os()
  let osVersion = md.versionStr(osName)
  let osId = 0
  if (osName === 'AndroidOS') {
    osVersion = md.versionStr('Android')
    osId = 1
  } else if (osName === 'iOS') {
    osId = 2
  }
  if (!osName) {
    osName = osVersion = getOSInfo()
    if (osName.indexOf('Win') !== -1) {
      osId = 3
    }
  }

  const timezong = new Date().getTimezoneOffset() / 60
  let logInfo = {
    when: new Date().getTime(), // 毫秒时间戳
    who: 'wanbei',
    platform: 'web',
    what: 'event',
    context: {
      browser: {
        tz: timezong < 0 ? '+' + -timezong : '-' + timezong, // 时区（如：+8）
        lang: navigator.language, // 语言
        width: window.screen.width, // 屏幕宽度
        height: window.screen.height, // 屏幕高度
        brover: getBrowserInfo().name + '/' + getBrowserInfo().version, // 浏览器版本
        os: osId || 0, // 操作系统,0:未知,1:Android2:IOS,3:PC
        osver: osVersion || '', // 操作系统版本
        ua: navigator.userAgent, // User-Agent
        ref: document.referrer // referrer
      },
      data: {
        page: 'home',
        action: 'btn_join',
        url: document.URL, // 当前日志打点页面URL
        time: new Date().getTime(),
        uid: '000',
        from: param2Obj().from || '',
        c: param2Obj().c || 'A_01',
        cs: param2Obj().cs || ''
        // cip: ''// 不用传，服务端生成
      }
    }
  }
  return logInfo
}

// 旧版首页精英入住参与打点
/* export function logDotJoinUs () {
  // console.log(getLogInfo())
  if (document.URL.indexOf('localhost') !== -1 || document.URL.indexOf('beta') !== -1) {
    alert('内部人员暂时不能参与')
  } else {
    const logInfo = getLogInfo()
    logBatchReport([logInfo]).then(function (res) {
    })
    window.open('https://www.wjx.top/jq/21253608.aspx')
  }
} */

// 通用日志打点
export function generalLogDot (data, callback) {
  const userInfo = getUserInfo() || {}
  const query = param2Obj()
  const logDot = new LogDot()
  const logData = {
    action: '', // 操作标识
    page: '', // 页面标识
    cat: '', // 栏目标识
    // time: '', // 触发时间戳，sdk自动补全，忽略
    cip: '', // 客户端外网，传空
    uid: userInfo.id || '000', // 用户Id，登录取登录用户ID,游客000
    // c: '', // 渠道参数，sdk初始化时已有，忽略
    // sc: query.sc || '', // 子渠道参数,sdk初始化时已有，忽略
    from: query.from || '', // 来源
    url: document.URL // 当前页面URL
  }
  window.Object.assign(logData, data)
  logDot.eventLog(logData, callback)
}
