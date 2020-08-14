/**
 * 链接拼接参数
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
String.prototype.splitJoin = function(obj) {
  var url = this
  if (obj instanceof Object) {
    for (var i in obj) {
      if (!obj[i]) continue
      if (!/(\]|\?|\[)/.test(url)) {
        url += '?' + i + '=' + obj[i]
      } else {
        url += '&' + i + '=' + obj[i]
      }
    }
  }
  return url
}

const uuid = (len = 16, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export default { uuid }
