import Check from './check'
/**
 * 去掉数组中的重复数据
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
const dedupe = array => [...new Set(array)]
const duplicate = array => fromSet(new Set(array))

/**
 * 将Set结构转为数组
 * @param  {[type]} set [description]
 * @return {[type]}     [description]
 */
const fromSet = set => Array.from(set)

/**
 * 返回兩數組的并集
 * @param  {[type]} a [数组1]
 * @param  {[type]} b [数组2]
 * @return {[type]}   [返回Set]
 */
const unionSet = (a, b, ...c) => new Set([...a, ...b, c])

/**
 * 返回兩數組的并集
 * @param  {[type]} a [数组1]
 * @param  {[type]} b [数组2]
 * @return {[type]}   [返回Array]
 */
const union = (a, b, ...c) => fromSet(unionSet(a, b, c))

/**
 * 返回两数组的交集
 * @param  {[type]} a [数组1]
 * @param  {[type]} b [数组2]
 * @return {[type]}   [返回Set]
 */
const intersectSet = (a, b) => new Set([...a].filter(x => b.has(x)))

/**
 * 返回两数组的交集
 * @param  {[type]} a [数组1]
 * @param  {[type]} b [数组2]
 * @return {[type]}   [返回Array]
 */
const intersect = (a, b) => fromSet(intersectSet(a, b))

/**
 * 返回两数组的差集
 * @param  {[type]} a [数组a]
 * @param  {[type]} b [数组b]
 * @return {[type]}   [返回set]
 */
const differenceSet = (a, b) => new Set([...a].filter(x => !b.has(x)))

/**
 * 返回两数组的差集
 * @param  {[type]} a [数组a]
 * @param  {[type]} b [数组b]
 * @return {[type]}   [返回Array]
 */
const difference = (a, b) => fromSet(differenceSet(a, b))

/**
 * 兼容的数组转换方法
 * @return {[type]} [description]
 */
const toArray = (() => (Array.from ? Array.from : obj => [].slice.call(obj)))()

/**
 * 方法返回一个布尔值，表示某个数组是否包含给定的值
 * @param  {Function} () [description]
 * @return {[type]}      [description]
 */
const contains = (() => (Array.prototype.includes ? (arr, value) => arr.includes(value) : (arr, value) => arr.some(el => el === value)))()

/**
 * 对象数组根据字段替换
 * @param  {[type]} arr   [description]
 * @param  {[type]} n     [新对象]
 * @param  {String} field [description]
 * @return {[type]}       [description]
 */
const replace = (arr, n, field = 'id') => {
  arr = arr.map(a => {
    return a[field] === n[field] ? n : a
  })
  return arr
}

/**
 * 对象数组数据更新
 * @param  {[type]} oldArr   [旧数组]
 * @param  {[type]} newArr     [新数组]
 * @return {[type]}       [description]
 */
const update = (oldArr, newArr) => {
  if (!Check.isRealArray(newArr)) {
    return oldArr
  }
  if (!Check.isRealArray(oldArr)) {
    return newArr
  }

  // 过滤删除删除数据
  oldArr = oldArr.filter(v => {
    return v.status !== 'd'
  })

  newArr.map(v => {
    let isNew = true
    oldArr = oldArr.map(k => {
      if (v.id === k.id) {
        // 做合并操作
        k = { ...k, ...v }
        isNew = false
      }
      return k
    })

    // 做插入操作
    if (isNew) {
      oldArr.push(v)
    }
  })
  return oldArr
}

/**
 * 排序
 * @param  {[type]} arrs   [description]
 * @param  {[type]} field [description]
 * @param  {[type]} desc  [description]
 * @return {[type]}       [description]
 */
const sort = (arrs, field = 'createTime', desc = 'desc') => {
  if (arrs == null) {
    return []
  }
  let _desc = desc === 'desc' ? 1 : -1
  let _asc = desc === 'desc' ? -1 : 1
  let _no = 0
  return arrs.sort((a, b) => {
    if (a === null || b === null) {
      return _no
    }
    if (!Check.isNull(a[field]) && !Check.isNull(b[field])) {
      if (desc === 'asc') {
        if (Check.isString(a[field])) {
          return a[field].trim().localeCompare(b[field].trim())
        } else {
          return a[field] - b[field]
        }
      }
      if (Check.isString(a[field])) {
        return b[field].trim().localeCompare(a[field].trim())
      } else {
        return b[field] - a[field]
      }
    } else {
      if (Check.isString(a[field]) && !Check.isNull(b[field])) {
        return _desc
      } else if (!Check.isString(a[field]) && Check.isNull(b[field])) {
        return _asc
      } else {
        return _no
      }
    }
  })
}

// 输出
export default {
  duplicate,
  dedupe,
  fromSet,
  difference,
  differenceSet,
  intersect,
  intersectSet,
  unionSet,
  union,
  toArray,
  contains,
  replace,
  sort,
  update
}
