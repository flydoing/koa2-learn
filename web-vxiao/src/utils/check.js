/**
 * 判断目标参数是否string类型或String对象
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isString = src => (Object.prototype.toString.call(src) === '[object String]' ? src.length > 0 : false)

/**
 * 判断是否是number、Number
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isNumber = src => {
  const flag = Object.prototype.toString.call(src) === '[object Number]' && isFinite(src)
  if (!flag && isString(src)) {
    return !isNaN(src)
  }
  return flag
}

/**
 * 判断是否是JSON字符串
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
const isJsonString = str => {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {}
  return false
}

/**
 * 判断是否数字或者带小数点的数字（小数点后2位）
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isPointNumber = src => {
  if (isNullString(src)) {
    return false
  }
  let patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
  return patten.test(src)
}

/**
 * 判断目标参数是否为function或Function实例
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isFunction = src => Object.prototype.toString.call(src) === '[object Function]'

/**
 * 判断是否为日期对象
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isDate = o => o instanceof Date && o.toString() !== 'Invalid Date' && !isNaN(o)

/**
 * 判断是否为数组
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isArray = src => src && Object.prototype.toString.call(src) === '[object Array]'

/**
 * 判断是否为Element对象
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isElement = source => !!(source && source.nodeName && source.nodeType === 1)

/**
 * 判断目标参数是否Boolean对象
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isBool = src => typeof src === 'boolean'

/**
 * 判断目标参数是否为Object对象
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isObject = source => typeof source === 'function' || !!(source && typeof source === 'object')

/**
 * 判断是否为空对象
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isNullObject = src => {
  for (var i in src) {
    if (src.hasOwnProperty(i)) {
      return false
    }
  }
  return true
}

/**
 * 判断是否为空
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isNull = src => src === null || src === undefined

/**
 * 判断是空字符串
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isNullString = src => isNull(src) || src === ''

/**
 * 判断是空数组
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const isNullArray = src => isNull(src) || src.length === 0
const isRealArray = src => isArray(src) && !isNullArray(src)
const isLength = (src, l = 20) => isRealArray(src) && src.length < l

/**
 * 手机号码验证，验证13系列和150-159(154除外)、180、185、186、187、188、189几种号码，长度11位
 * @param  {[type]} mobile [description]
 * @return {[type]}        [description]
 */
const isMobile = mobile => {
  if (isNull(mobile)) {
    return false
  }
  if (mobile.length !== 11) {
    return false
  }
  return /^13\d{9}$/g.test(mobile) || /^15[0-35-9]\d{8}$/g.test(mobile) || /^18[05-9]\d{8}$/g.test(mobile)
}

/**
 * 验证邮箱
 * @param  {[type]} email [description]
 * @return {[type]}       [description]
 */
const isEmail = email => {
  if (isNull(email)) {
    return false
  }
  return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email)
}

/**
 * 日期格式 验证
 * @param  {[type]} date   [字符串]
 * @param  {[type]} format [format 验证类型，默认yyyy-MM-dd]
 * @return {[type]}        [description]
 */
const isDateStr = (date, format = 'yyyy-MM-dd') => {}

/**
 * 处理null、undefined 为""
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
const toStr = src => (isNullString(src) ? '' : src)

// 输出
export default {
  toStr,
  isDateStr,
  isArray,
  isBool,
  isDate,
  isElement,
  isEmail,
  isFunction,
  isMobile,
  isNull,
  isNumber,
  isPointNumber,
  isObject,
  isNullObject,
  isString,
  isNullArray,
  isNullString,
  isRealArray,
  isLength,
  isJsonString
}
