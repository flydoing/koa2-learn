import Check from './check'

const DateUtils = {
  YMD_HMS: 'yyyy-MM-dd hh:mm:ss',
  YMD_HM: 'yyyy-MM-dd hh:mm',
  YMD: 'yyyy-MM-dd',
  MD: 'MM-dd',
  MDHM: 'MM-dd hh:mm',
  HM: 'hh:mm',
  YMD1: 'yyyy/MM/dd',
  format(date = new Date(), pattern = DateUtils.YMD_HMS) {
    try {
      if (Check.isString(date)) {
        date = new Date(date.split('.')[0].replace(/-/g, '/'))
      }
    } catch (e) {
      date = new Date()
    }
    return DateUtils.ft(date, pattern)
  },

  /**
   * 业务中文转换
   * @type {[type]}
   */
  converFormat(date = new Date()) {
    let f = DateUtils._converFormat(date)
    if (f === 'Y') {
      return `昨天 ` + DateUtils.format(date, DateUtils.HM)
    } else if (f === 'L') {
      return `前天 ` + DateUtils.format(date, DateUtils.HM)
    } else if (f === 'T') {
      return DateUtils.format(date, DateUtils.HM)
    } else if (f === 'H') {
      return DateUtils.format(date, DateUtils.YMD1)
    } else if (f === 'F') {
    }
  },

  _converFormat(date = new Date()) {
    if (Check.isString(date)) {
      date = new Date(date.split('.')[0].replace(/-/g, '/'))
    }
    let cur = new Date()
    let now = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate())
    if (now.getTime() - date.getTime() > 0 && now.getTime() - date.getTime() <= 86400000) {
      return 'Y'
    } else if (now.getTime() - date.getTime() <= 2 * 86400000 && now.getTime() - date.getTime() > 86400000) {
      return 'L'
    } else if (now.getTime() - date.getTime() > 2 * 86400000) {
      return 'H'
    } else if (now.getTime() - date.getTime() < 86400000 && now.getTime() - date.getTime() > -86400000) {
      return 'T'
    } else {
      return 'F'
    }
  },

  ft(date = new Date(), pattern = DateUtils.YMD_HMS) {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(pattern)) {
        pattern = pattern.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k + ''] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return pattern
  },

  day2week(day) {
    switch (DateUtils.day1week(day)) {
      case 1:
        return '周一'
      case 2:
        return '周二'
      case 3:
        return '周三'
      case 4:
        return '周四'
      case 5:
        return '周五'
      case 6:
        return '周六'
      case 0:
        return '周日'
    }
  },

  day1week(day) {
    day = day.replace(/-/g, '/').split('.')[0]
    let date = new Date(day)
    return date.getDay()
  },

  /**
   * format_Y_M_D_H_M_S_0800 补 .000 +0800
   */
  format_0800(str) {
    let date = str
    if (Check.isString(str)) {
      let dataStr = str.replace(/-/g, '/').split('.')[0]
      date = new Date(dataStr)
    }
    return DateUtils.format(date, DateUtils.YMD_HMS) + '.000 +0800'
  },

  /**
   * 获取周日期
   * @param {Object} v
   * @param {String} type
   */
  getWeekDate(v, type) {
    // 今天是本周的第几天
    let curDayOfWeek = v.getDay()
    // 当前日
    let curDay = v.getDate()
    // 当前月
    let curMonth = v.getMonth()
    // 当前年
    let curYear = v.getFullYear()

    return new Date(curYear, curMonth, type === 'start' ? curDay - curDayOfWeek + 1 : curDay + (7 - curDayOfWeek))
  },

  /**
   * [function 获取某个时间延后每天的YYYY-MM-DD]
   * @param  {[type]} time   [YYYY-MM-DD]
   * @param  {[type]} numBer [num]
   * @return {[type]}        [description]
   */
  getEveryDay(time, numBer) {
    let startDate = time.split('-')
    startDate[0] = parseInt(startDate[0])
    startDate[1] = parseInt(startDate[1]) - 1
    startDate[2] = parseInt(startDate[2])
    let EveryDay = []
    for (let i = 0; i < numBer; i++) {
      var tmp = new Date(startDate[0], startDate[1], startDate[2] + i).toString()
      var date = DateUtils.format_0800(tmp)
      EveryDay[i] = date
    }
    return EveryDay
  },

  /**
   * 日期加减
   */
  plusDate(date, number) {
    let t = new Date(date.getTime())
    return new Date(t.setDate(t.getDate() + number))
  }
}

export default DateUtils
