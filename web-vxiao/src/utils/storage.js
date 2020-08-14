/**
 * sessionStorage
 * @type {Object}
 */
export const session = {
  clear() {
    return sessionStorage.clear()
  },
  set(key, value) {
    return sessionStorage.setItem(key, value)
  },
  get(key, cache = true) {
    let value = null
    try {
      value = JSON.parse(sessionStorage.getItem(key))
      if (!cache) {
        sessionStorage.removeItem(key)
      }
    } catch (err) {}
    return value
  },
  remove(key) {
    return sessionStorage.removeItem(key)
  },
  removeLike(key) {
    let that = this
    Object.keys(window.sessionStorage).forEach(k => {
      k.indexOf(key) > -1 && that.remove(k)
    })
  }
}
/**
 * localStorage
 * @type {Object}
 */
export const local = {
  clear() {
    return localStorage.clear()
  },
  set(key, value) {
    return localStorage.setItem(key, value)
  },
  getString(key) {
    return localStorage.getItem(key)
  },
  get(key, cache = true) {
    let v = localStorage.getItem(key)
    if (!cache) {
      localStorage.removeItem(key)
    }
    return JSON.parse(v)
  },
  getKeys(key) {
    let keys = []
    const storage = window.localStorage
    for (let i = 0; i < storage.length; i++) {
      if (key !== null && key !== undefined && storage.key(i).indexOf(key) >= 0) {
        keys.push(storage.key(i))
        continue
      }
      keys.push(storage.key(i))
    }
    return keys
  },
  like(key) {
    let arr = []
    const storage = window.localStorage
    if (storage && storage.key) {
      Object.keys(window.localStorage).forEach(k => {
        k.indexOf(key) > -1 && arr.push(localStorage.getItem(k))
      })
    }
    return arr
  },
  likeNot(key) {
    let arr = []
    const storage = window.localStorage
    if (storage && storage.key) {
      Object.keys(window.localStorage).forEach(k => {
        // k.indexOf(key) > -1 && arr.push(localStorage.getItem(k))
        k.indexOf(key) > -1 && k.indexOf('_read') < 0 && arr.push(localStorage.getItem(k))
      })
    }
    return arr
  },
  remove(key) {
    return localStorage.removeItem(key)
  },
  removeLike(key) {
    let that = this
    Object.keys(window.localStorage).forEach(k => {
      k.indexOf(key) > -1 && that.remove(k)
    })
  }
}
