/**
 * 合并组数
 * @param  {...[type]} sources [description]
 * @return {[type]}            [description]
 */
const merge = (target, ...sources) => { Object.assign(target, sources) }

/**
 * 迭代对象的可枚举属性，以及值
 * @param  {[type]} obj    [源对象]
 * @param  {[type]} cback  [回调]
 * @param  {[type]} extend [返回包括继承属性]
 * @return {[type]}        [description]
 */
const forEachKeys = (obj, cback, extend) => {
  if (extend === false) {
    _forEachKeys(obj, cback)
  } else {
    for (let k in obj) {
      cback(k, obj[k])
    }
  }
}

const _forEachKeys = (obj, cback) => Object.keys(obj).forEach((k, i) => cback(k, obj[k], i))

// 输出
export default { merge, forEachKeys }
