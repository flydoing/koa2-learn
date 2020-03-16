/**
 * Created by shanfang 2018-1-20.
 */

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */

/* export function getByteLen (val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
} */

export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param (json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj (url) {
  if (!url) {
    url = document.URL
  }
  if (url.indexOf('?') === -1) {
    return {}
  }
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

// 去掉两字符两边的空格
export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function objectMerge (target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo (element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick (picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick (picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/*
// 数据模型类
// 使用示例
const dataModel = new DataModel({
  newArticle: {
    type: String,
    default: '',
    from: { key: 'article', get: function (val) { return val.id } }, // 进规则配置
    to: { key: 'saveArticle', type: Object, get: function (val) { return { id: val } } } // 出规则配置
  }
})
const addData = dataModel.initData() // 新增的数据
const editData = dataModel.initData({ id: '1', article: { title: 'title', id: 1 }}) // 编辑的数据
const sendData = dataModel.getData() // 要保存的数据
*/

export class DataModel {
  constructor (model) {
    this.model = model
    this.modelByFromKey = {}
    for (const o in model) {
      const item = model[o]
      if (item.from && item.from.key) {
        this.modelByFromKey[item.from.key] = item
        this.modelByFromKey[item.from.key].key = o
      } else {
        this.modelByFromKey[o] = item
        this.modelByFromKey[o].key = o
      }
    }
    this.data = null // 模型生成的数据
  }

  // 设置初始化数据
  initData (data) {
    this.data = this.transition(data)
    return this.data
  }

  // 获取数据
  getData () {
    return this.transition(this.data, true)
  }

  // 数据转换
  transition (data, isOut) {
    const returnData = []
    const modelDefault = {}
    for (const o in this.model) {
      modelDefault[o] = this.model[o].default
    }
    if (!data) {
      return modelDefault
    }
    let transitionData = JSON.parse(JSON.stringify(data))
    if (!Array.isArray(transitionData)) {
      transitionData = [transitionData]
    }
    for (let i = 0; i < transitionData.length; i++) {
      const item = transitionData[i]
      const newItem = {}
      // 转换
      for (const o in item) {
        const modelByFromKeyItem = this.modelByFromKey[o]
        const modelByToKeyItem = this.model[o]
        if (!isOut) {
          if (modelByFromKeyItem) {
            const type = modelByFromKeyItem.type // 数据类型
            const key = modelByFromKeyItem.key // 模型属性
            const from = modelByFromKeyItem.from || {} // 来源
            const fromGet = from.get // 获取来源属性值回调
            // 转换来源数据
            if (fromGet) {
              item[o] = fromGet(item[o], item)
            } else {
              item[o] = this.changeType(item[o], type)
            }
            newItem[key] = item[o]
          }
        } else {
          if (modelByToKeyItem) {
            const type = modelByToKeyItem.type // 数据类型
            const to = modelByToKeyItem.to || {} // 输出
            const toKey = to.key || o // 输出属性
            const toGet = to.get // 获取输出属性值回调
            // 转换输出数据
            if (toGet) {
              item[o] = toGet(item[o], item)
            } else {
              item[o] = this.changeType(item[o], type)
            }
            newItem[toKey] = item[o]
          }
        }
      }
      returnData.push(Object.assign({}, modelDefault, newItem))
    }
    if (returnData.length === 1) {
      return returnData[0]
    } else {
      return returnData
    }
  }

  // 数据类型转换
  changeType (value, type) {
    if (!value || !type) {
      return value
    }
    if (type === String) {
      if (typeof value !== 'string') {
        try {
          return JSON.stringify(value)
        } catch (e) {
          return String(value)
        }
      } else {
        return value
      }
    } else if (type === Number) {
      return Number(value)
    } else if (type === Object || type === Array) {
      if (typeof value !== 'object') {
        try {
          return JSON.parse(value)
        } catch (e) {
          return value
        }
      } else {
        return value
      }
    }
  }
}

// 获取浏览器名称和版本号
export function getBrowserInfo () {
  const browser = { name: 'unknown', version: 0 }
  const userAgent = window.navigator.userAgent.toLowerCase()
  if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
    browser.name = RegExp.$1
    browser.version = RegExp.$2
  } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari
    browser.name = 'safari'
    browser.version = RegExp.$2
  }
  return browser
}

// 获取操作系统版本
export function getOSInfo () {
  const sUserAgent = navigator.userAgent
  const isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
  const isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
  if (isMac) return 'Mac'
  const isUnix = (navigator.platform === 'X11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  const isLinux = (String(navigator.platform).indexOf('Linux') > -1)
  if (isLinux) return 'Linux'
  if (isWin) {
    const isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
    if (isWin2K) return 'Win2000'
    const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
    if (isWinXP) return 'WinXP'
    const isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
    if (isWin2003) return 'Win2003'
    const isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
    if (isWinVista) return 'WinVista'
    const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
    if (isWin7) return 'Win7'
    const isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1
    if (isWin10) return 'Win10'
  }
  return 'other'
}

export function getSystemInfo () {
  /* const digits = function () {
    const agent = navigator.userAgent.toLowerCase()
    const sUserAgent = navigator.userAgent
    const is64 = sUserAgent.indexOf('WOW64') > -1
    if (is64) {
      return '64位'
    } else {
      return '32位'
    }
  } */
  const sUserAgent = navigator.userAgent
  const isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
  const isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
  if (isMac) return 'Mac'
  const isUnix = (navigator.platform === 'X11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  const isLinux = (String(navigator.platform).indexOf('Linux') > -1)
  const bIsAndroid = sUserAgent.toLowerCase().match(/android/i) === 'android'
  if (isLinux) {
    if (bIsAndroid) return 'Android'
    else return 'Linux'
  }
  if (isWin) {
    const isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
    if (isWin2K) return '操作系统：Win2000'
    const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
    if (isWinXP) return '操作系统：WinXP'
    const isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
    if (isWin2003) return '操作系统：Win2003'
    const isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
    if (isWinVista) return '操作系统：WinVista'
    const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
    if (isWin7) return '操作系统：Win7'
    const isWin8 = sUserAgent.indexOf('windows nt6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1
    if (isWin8) return '操作系统：Win8'
  }
  return '其他'
}

// 内容字符转换
export function contentTransform (content) {
  let $ = window.$
  if (!content) {
    return
  }
  // 转换@某人
  let newContent = content.replace(/@[^@#;<>\n\r\s]+\s/g, function (str) {
    str = str.replace(' ', '')
    return '<span data-selector="at-user">' + str + '</span> '
  })
  newContent = newContent.replace(/@[^@#;<>\n\r\s]+&nbsp;/g, function (str) {
    str = str.replace('&nbsp;', '')
    return '<span data-selector="at-user">' + str + '</span> '
  })
  // 去除@某人嵌套标签
  /* newContent = newContent.replace(/<span data-selector="at-user"><span data-selector="at-user">[^<]+<\/span><\/span>/g, function (str) {
   return $(str).html()
   }) */
  // 转换插入话题
  newContent = newContent.replace(/#[^@#;<>\n\r\s]+#/g, function (str) {
    return '<span data-selector="topic">' + str + '</span>'
  })
  // 去除插入话题嵌套标签
  newContent = newContent.replace(/<span data-selector="topic"><span data-selector="topic">[^<>]+<\/span><\/span>/g, function (str) {
    return $(str).html()
  })
  // 转换视频标签
  newContent = newContent.replace(/<img[^>]+data-mce-p-src[^>]+>/g, function (str) {
    const tag = $(str)
    const src = tag.attr('data-mce-p-src')
    let poster = tag.attr('data-mce-p-poster') || ''
    if (poster === '' && src) {
      poster = src.split('?')[0] + '?x-oss-process=video/snapshot,t_2000,f_jpg,w_0,h_0'
    }
    return '<video controls="controls" src="' + src + '" poster="' + poster + '"></video>'
  })
  // 过滤iframe
  newContent = newContent.replace(/<iframe[^>]+>[^<]+<\/iframe>/g, '')
  return newContent
}

// cookies 操作
export const cookie = {
  addCookie: function (name, value, expireHours) {
    var cookieString = name + '=' + escape(value)
    // 判断是否设置过期时间
    if (expireHours > 0) {
      var date = new Date()
      date.setTime(date.getTime + expireHours * 3600 * 1000)
      cookieString = cookieString + '; expire=' + date.toGMTString()
    }
    document.cookie = cookieString
  },
  getCookie: function (name, coolieStr) {
    var strCookie = coolieStr || document.cookie
    var arrCookie = strCookie.split('; ')
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split('=')
      if (arr[0] === name) return arr[1]
    }
    return ''
  },
  deleteCookie: function (name) {
    var date = new Date()
    date.setTime(date.getTime() - 10000)
    document.cookie = name + '=v; expire=' + date.toGMTString()
  }
}

// 判断是否是客户端
export function isClient () {
  let isClient = false
  try {
    if (window) {
      isClient = true
    }
  } catch (e) {
  }
  return isClient
}

// 生成GUID
export function guid (symbol) {
  if (!symbol) {
    symbol = '-'
  }
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + symbol + S4() + symbol + S4() + symbol + S4() + symbol + S4() + S4() + S4())
}

export function mousewheel (selector, upFunction, downFunction) {
  var MousewheelObj = document.querySelector(selector)
  MousewheelObj.onmousewheel = function scrollWheel (e) {
    var sl
    e = e || window.event
    if (navigator.userAgent.toLowerCase().indexOf('msie') >= 0) {
      event.returnValue = false
    } else {
      e.preventDefault()
    }
    if (e.wheelDelta) {
      sl = e.wheelDelta
    } else if (e.detail) {
      sl = -e.detail
    }
    if (sl < 0) {
      downFunction()
    } else {
      upFunction()
    }
  }
  // 让firefox支持onmousewheel
  if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
    addEventListener('DOMMouseScroll',
      function (e) {
        var obj = e.target
        var onmousewheel
        while (obj) {
          onmousewheel = obj.getAttribute('onmousewheel') || obj.onmousewheel
          if (onmousewheel) break
          if (obj.tagName === 'BODY') break
          obj = obj.parentNode
        }
        if (onmousewheel) {
          if (e.preventDefault) e.preventDefault()
          e.returnValue = false // 禁止页面滚动
          /* if (typeof obj.onmousewheel !== 'function') {
            // 将onmousewheel转换成function
            eval('window._tmpFun = function(event){' + onmousewheel + '}')
            obj.onmousewheel = window._tmpFun
            window._tmpFun = null
          } */
          // 不直接执行是因为若onmousewheel(e)运行时间较长的话，会导致锁定滚动失效，使用setTimeout可避免
          setTimeout(function () {
            obj.onmousewheel(e)
          }, 1)
        }
      },
      false)
  }
}

/*
*图片加载完毕前获取尺寸
*使用案例：
imgReady('图片地址', function () {
alert('size ready: width=' + this.width + '; height=' + this.height);
});
*/
export const imgReady = (function () {
  const list = []
  let intervalId = null
  // 用来执行队列
  const tick = function () {
    for (let i = 0; i < list.length; i++) {
      list[i].end ? list.splice(i--, 1) : list[i]()
    }
    !list.length && stop()
  }
  // 停止所有定时器队列
  const stop = function () {
    clearInterval(intervalId)
    intervalId = null
  }
  return function (url, ready, load, error) {
    let onready, width, height, newWidth, newHeight
    let img = new Image()
    img.src = url
    // 如果图片被缓存，则直接返回缓存数据
    if (img.complete) {
      ready.call(img)
      load && load.call(img)
      return
    }
    width = img.width
    height = img.height
    // 加载错误后的事件
    img.onerror = function () {
      error && error.call(img)
      onready.end = true
      img = img.onload = img.onerror = null
    }
    // 图片尺寸就绪
    onready = function () {
      newWidth = img.width
      newHeight = img.height
      if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
        ready.call(img)
        onready.end = true
      }
    }
    onready()
    // 完全加载完毕的事件
    img.onload = function () {
      // onload在定时器时间差范围内可能比onready快
      // 这里进行检查并保证onready优先执行
      !onready.end && onready()
      load && load.call(img)
      // IE gif动画会循环执行onload，置空onload即可
      img = img.onload = img.onerror = null
    }
    // 加入队列中定期执行
    if (!onready.end) {
      list.push(onready)
      // 无论何时只允许出现一个定时器，减少浏览器性能损耗
      if (intervalId === null) intervalId = setInterval(tick, 40)
    }
  }
})()

// img转base64,传入图片或者图片路径，promise返回base64
export const imgToBase64 = function (img, callback) {
  const getBase64Image = function (img, width, height) {
    // width、height调用时传入具体像素值，不传则默认图像大小
    const canvas = document.createElement('canvas')
    canvas.width = width || img.width
    canvas.height = height || img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const dataURL = canvas.toDataURL()
    return dataURL
  }
  const image = new Image()
  image.crossOrigin = ''
  image.src = img
  // const deferred = $.Deferred()
  if (img) {
    image.onload = function () {
      // 将base64传给done上传处理
      // deferred.resolve(getBase64Image(image))
      callback(getBase64Image(image))
    }
    // return deferred.promise()
  }
}
