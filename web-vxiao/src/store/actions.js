import LoginApi from '@/api/login'
import UserApi from '@/api/user'
import * as STORAGE from '@/constant/storage'
import * as Storage from '@/utils/storage'
import Check from '@/utils/check'

/**
 * 登录action
 * @param  {[type]} options.commit   [description]
 * @param  {[type]} options.account  [description]
 * @param  {[type]} options.password [description]
 * @return {[type]}                  [description]
 */
export const signin = async ({ commit }, { account, password, url, accessToken, code, timeStamp }) => {
  const auth = await LoginApi.singIn(account, password, url, accessToken, code, timeStamp)
  return new Promise((resolve, reject) => {
    if (auth.code === '1') {
      commit('saveSigninStatus', true)
      commit('saveConfig', { auth: auth.userData, account: account })
      commit('saveUser', auth.userData.userInfo)
      // 存储userInfo 入localStorage
      Storage.local.set(`${STORAGE.LOCAL_USER_INFO}`, JSON.stringify(auth.userData))
      Storage.local.set(`${STORAGE.LOCAL_ACCOUNT}`, account)
      resolve(auth)
    } else {
      reject(auth)
    }
  })
}

/**
 * 初始化本地已经登录的localStorage
 * @param  {[type]} options.commit [description]
 * @return {[type]}                [description]
 */
export const initLocatStorage = async ({ commit }) => {
  try {
    const auth = Storage.local.get(STORAGE.LOCAL_USER_INFO)
    const account = Storage.local.getString(STORAGE.LOCAL_ACCOUNT)
    const groupInfo = Storage.local.get(STORAGE.LOCAL_GROUP_INFO)
    return new Promise((resolve, reject) => {
      if (!Check.isNullObject(auth)) {
        commit('saveSigninStatus', true)
        commit('saveConfig', { auth: auth, account: account })
        commit('saveUser', auth.userInfo)
        commit('saveGroupInfo', Check.isNull(groupInfo) ? true : groupInfo)
        resolve()
      } else {
        reject(auth)
      }
    })
  } catch (e) {}
}

/**
 * 登录加载基础数据（群、群关系、应用、应用关系）action
 * @param  {[type]} options.commit [description]
 * @param  {[type]} userId         [description]
 * @return {[type]}                [description]
 */
export const getUserBase = async ({ commit }) => {
  // 服务器拉取基础数据
  const baseData = await UserApi.getUserBase()
  if (baseData) {
    return new Promise((resolve, reject) => {
      commit('saveGroups', baseData.groups)
      commit('saveSigninGroupRelation', baseData.relations)
      commit('saveApps', baseData.apps)
      commit('saveMetaDatas', baseData.metaDatas)
      resolve()
    })
  }
}

/**
 * 显示弹窗模板
 * @param  {[type]}  options.commit [description]
 * @param  {[type]}  options.state  [description]
 * @param  {Boolean} status         [description]
 * @return {[type]}                 [description]
 */
export const showPage = ({ commit }, status = true) => {
  if (!status) {
    commit('modifyBranchId', null)
    commit('modifyEducationId', null)
  }
  commit('showPage', status)
}

/**
 * 窗口变化
 * @Author   clz
 * @DateTime 2018-10-10
 * @param    {[type]}   options.commit [description]
 * @param    {Object}   resize         [description]
 * @return   {[type]}                  [description]
 */
export const resize = ({ commit }, resize = { w: window.innerWidth, h: window.innerHeight }) => {
  commit('resize', resize)
}

/**
 * 全局搜索
 * @Author   clz
 * @DateTime 2018-11-05
 * @param    {[type]}   options.commit [description]
 * @param    {String}   search         [description]
 * @return   {[type]}                  [description]
 */
export const globalSearch = ({ commit }, search = '') => {
  commit('globalSearch', search)
}

/**
 * 群关于开关
 * @Author   clz
 * @DateTime 2018-11-10
 * @param    {[type]}   options.commit [description]
 * @param    {Boolean}  status         [description]
 * @return   {[type]}                  [description]
 */
export const showGroupContacts = ({ commit }, status = true) => {
  commit('saveGroupInfo', status)
  Storage.local.set(`${STORAGE.LOCAL_GROUP_INFO}`, status)
}

/**
 * 菜单类型
 * @Author   zcy
 * @DateTime 2019-08-08
 * @param    {String}  value         [description]
 * @return   {[type]}                  [description]
 */
export const setMenuType = ({ commit }, value = '1') => {
  commit('saveMenuType', value)
}

/**
 * 弹页是否需要提示关闭
 * @Author   clz
 * @DateTime 2018-11-10
 * @param    {[type]}   options.commit [description]
 * @param    {Boolean}  status         [description]
 * @return   {[type]}                  [description]
 */
export const modifyClosingPrompt = ({ commit }, status = false) => {
  return new Promise(resolve => {
    commit('modifyClosingPrompt', status)
    resolve()
  })
}

/**
 * 登录状态
 * @Author   clz
 * @DateTime 2018-11-10
 * @param    {[type]}   options.commit [description]
 * @param    {Boolean}  status         [description]
 * @return   {[type]}                  [description]
 */
export const modifySigninStatus = ({ commit }, status = false) => {
  commit('saveSigninStatus', status)
}
