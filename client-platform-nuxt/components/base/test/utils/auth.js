import Cookies from 'js-cookie'

const TokenKey = 'user-token'
const userInfo = 'userInfo'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function setUserInfo (data) {
  return Cookies.set(userInfo, data)
}
export function getUserInfo () {
  return Cookies.getJSON(userInfo)
}
export function removeUserInfo () {
  return Cookies.remove(userInfo)
}
