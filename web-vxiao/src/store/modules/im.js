import Vue from 'vue'
import Api from '@/api/im'
import Check from '@/utils/check'
import ArrayUtils from '@/utils/array'
import Image from '@/constant/image'
import * as IM from '@/constant/im'
import * as Storage from '@/utils/storage'
import DateFormat from '@/utils/date'

export default {
  namespaced: true,
  state: {
    loaded: false,
    current: {},
    imSessions: [],
    imMessages: {},
    imBubble: {},
    newlyAdded: 1
  },
  actions: {
    async saveCurrentSession({ commit, rootState }, session) {
      Storage.local.set(`${rootState.USERID}_IM`, JSON.stringify(session))
      commit('saveCurrentSession', session)
    },
    async loadImSession({ commit, state }, userId) {
      if (!state.loaded) {
        const res = await Api.getMessages(userId)
        return new Promise((resolve, reject) => {
          if (res && Check.isRealArray(res.messages)) {
            commit('saveImSessions', res.messages)
            commit('saveLoaded', true)
          }
          resolve(res)
        })
      }
    },
    async loadImMessageList({ commit }, { sessionId = 0, minId = null, groupId = null }) {
      let res = await Api.getChildMessages(sessionId, minId, groupId)
      if (res && Check.isRealArray(res.messages)) {
        let messages = res.messages.reverse()
        return new Promise(resolve => {
          commit('saveImMessages', { sessionId, messages, minId })
          resolve(res)
        })
      }
    },
    async sendImMessage({ commit }, message) {
      let res = await Api.sendMessage(message)
      if (res && Check.isRealArray(res.messages)) {
        return new Promise((resolve, reject) => {
          res.messages.forEach(m => {
            if (m.type === IM.IM_CHILD) {
              commit('saveImMessage', m)
            } else {
              commit('modifyImSession', m)
            }
          })
          resolve(res)
        })
      }
    },
    saveImMessage({ commit }, message) {
      commit('saveImMessage', message)
    },
    modifyImSession({ commit }, session) {
      commit('modifyImSession', session)
    },
    saveImSession({ commit }, session) {
      commit('saveImSession', session)
    },
    /**
     * IM气泡
     * @param  {[type]} options.commit    [description]
     * @param  {[type]} options.rootState [description]
     * @param  {[type]} message           [description]
     * @return {[type]}                   [description]
     */
    saveImBubble({ commit, state, rootState }, message) {
      if (state.current.id !== message.parentId) {
        commit('saveImBubble', message)
        Storage.local.set(`RM_${rootState.USERID}_${message.id}`, JSON.stringify(message))
      } else {
        commit('saveImMessage', message)
        commit('imScrollRefresh')
      }
    },
    /**
     * 删除气泡
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    removeImBubbleById({ commit, state, rootState }, sessionId) {
      let _ms = Object.values(state.imBubble)
      _ms.some(m => {
        if (m.parentId === sessionId) {
          commit('removeImBubble', m)
          Storage.local.remove(`RM_${rootState.USERID}_${m.id}`)
        }
      })
    }
  },
  mutations: {
    // 监听新增
    imScrollRefresh(state) {
      state.newlyAdded++
    },
    // 存储当前会话
    saveCurrentSession(state, session) {
      state.current = session
    },
    // 存储消息list会话
    saveImSessions(state, sessions) {
      state.imSessions = sessions
    },
    // 存储单个消息会话
    saveImSession(state, session) {
      state.imSessions.push(session)
    },
    // 更新会话
    modifyImSession(state, session) {
      if (
        state.imSessions.filter(im => {
          return session.id === im.id || (session.type === '1009' && session.userId === im.userId) || (session.type === '1008' && session.groupId === im.groupId)
        }).length > 0
      ) {
        state.imSessions.some((s, i) => {
          if (session.id === s.id || (session.type === '1009' && session.userId === s.userId) || (session.type === '1008' && session.groupId === s.groupId)) {
            Vue.set(state.imSessions, i, { ...s, ...session })
            return true
          }
        })
      } else {
        state.imSessions.push(session)
      }
    },
    // 存储会话子消息
    saveImMessages(state, { sessionId, messages = [], minId = null }) {
      // minId为空，则代表是第一次加载，如果不为空则代表加载历史更多消息，需要添加在列表前面
      if (!state.imMessages.hasOwnProperty(sessionId) || !minId) {
        Vue.set(state.imMessages, sessionId, messages)
      } else {
        Vue.set(state.imMessages, sessionId, [...messages, ...state.imMessages[sessionId]])
      }
    },
    // 存储会话单个子消息
    saveImMessage(state, m) {
      let sessionId = m.parentId
      if (!state.imMessages.hasOwnProperty(sessionId)) {
        Vue.set(state.imMessages, sessionId, [m])
      } else {
        let isExist = false
        state.imMessages[sessionId].some((_m, i) => {
          if (_m.refId === m.refId) {
            Vue.set(state.imMessages[sessionId], i, m)
            isExist = true
            return true
          }
        })
        if (!isExist) {
          state.imMessages[sessionId].push(m)
        }
      }
    },
    /**
     * im未读气泡
     * @param  {[type]} state   [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    saveImBubble(state, message) {
      Vue.set(state.imBubble, message.id, message)
    },
    /**
     * 更新IM气泡
     * @param  {[type]} state   [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    removeImBubble(state, message) {
      Vue.delete(state.imBubble, message.id)
    },
    saveLoaded(state, boolean) {
      state.loaded = boolean
    }
  },
  getters: {
    isScrollRefresh(state) {
      return state.newlyAdded
    },
    getImBubble(state) {
      return Object.values(state.imBubble)
    },
    /**
     * 获取当前会话
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getCurrentSession(state) {
      return state.current
    },
    /**
     * 获取IM会话列表
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getImSessions(state, getters, rootState) {
      let messages = Object.assign([], state.imSessions)
      let bubbles = Object.values(state.imBubble) || []
      return ArrayUtils.sort(messages, 'modifyTime', 'desc').map(m => {
        let o = { id: m.id, type: m.type, scoure: m }
        let ms = state.imMessages[m.id]
        let last = {}
        if (Check.isRealArray(ms)) {
          last = ms[ms.length - 1] || {}
        }
        if (m.type === IM.IM_GROUP) {
          o.title = m.title
          o.avatar = Image.ICO_GROUP
          o.groupId = m.groupId
        } else {
          // 如果fromUserId=== 登录用户
          let _m = Check.isNullObject(last) ? m : last
          if (_m.fromUserId === rootState.USERID) {
            o.title = _m.userName
            o.avatar = `${rootState.FILE_URL}/${_m.userAvatar}`
            o.userId = _m.userId
          } else if (_m.userId === rootState.USERID) {
            o.title = _m.fromUserName
            o.avatar = `${rootState.FILE_URL}/${_m.fromUserAvatar}`
            o.userId = _m.fromUserId
          }
        }
        o.content = last.content || ''
        o.time = DateFormat.converFormat(new Date(m.modifyTime))
        o.bubbleCount = bubbles.filter(_m => {
          return _m.parentId === m.id
        }).length
        return o
      })
    },

    /**
     * 获取当前会话详情
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getImSessionById: state => id => {
      // return state.imSessions.filter() || {}
    },

    /**
     * 获取当前会话的子消息列表
     * @param  {[type]} state   [description]
     * @param  {[type]} getters [description]
     * @return {[type]}         [description]
     */
    getImMessages(state, getters) {
      if (state.current) {
        return Object.values(state.imMessages[state.current.id] || [])
      }
      return []
    },
    /**
     * 返回主会话id下子消息列表
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getImMessagesById: state => sessionId => {
      return Object.values(state.imMessages[sessionId])
    },
    getImLastMessageById: state => sessionId => {
      return state.imMessages[sessionId][0]
    },
    /**
     * getter 群聊会话
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getImGroupSession(state) {
      return state.imSessions.filter(m => {
        return m.type === IM.IM_GROUP
      })
    },
    /**
     * getter 私信
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getImUserSession(state) {
      return state.imSessions.filter(m => {
        return m.type === IM.IM_USER
      })
    }
  }
}
