import Vue from 'vue'
import Check from '@/utils/check'
import MessageApi from '@/api/message'
import ArrayUtils from '@/utils/array'

export default {
  state: {
    messages: {}
  },
  actions: {
    /**
     * 拉取消息列表
     * @param  {[type]} options.commit  [description]
     * @param  {[type]} options.state   [description]
     * @param  {[type]} options.groupId [description]
     * @param  {[type]} options.type    [description]
     * @return {[type]}                 [description]
     */
    async getMessages({ commit }, options) {
      let res = await MessageApi.getMessages(options)
      let messages = res.messages
      let groupId = options.groupId
      return new Promise((resolve, reject) => {
        if (res && Check.isRealArray(messages)) {
          commit('saveGroupMessages', { groupId, messages, index: options.currentPage === 1 })
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    async addMessage({ commit }, message) {
      let res = await MessageApi.addMessage(message)
      let groupId = message.groupId
      return new Promise((resolve, reject) => {
        if (res && Check.isRealArray(res.messages)) {
          const m = res.messages[0]
          commit('saveGroupMessage', { groupId, m })
          resolve(m)
        } else {
          reject(res)
        }
      })
    },
    async modifyMessage({ commit }, message) {
      const res = await MessageApi.modifyMessage(message)
      const groupId = message.groupId
      return new Promise((resolve, reject) => {
        if (res && Check.isRealArray(res.messages)) {
          const m = res.messages[0]
          commit(m.status === 'd' ? 'removeGroupMessage' : 'modifyGroupMessage', { groupId, m })
          resolve(m)
        } else {
          reject(res)
        }
      })
    },
    updateMessage({ commit }, m) {
      const groupId = m.groupId
      return new Promise((resolve, reject) => {
        commit('modifyGroupMessage', { groupId, m })
        resolve(m)
      })
    }
  },
  getters: {
    getCurrentMessages(state, getters, rootState) {
      let messages = state.messages[rootState.group.groupId] || {}
      return Object.values(messages)
    },
    getMessagesById: state => (groupId) => {
      let messages = state.messages[groupId] || {}
      return Object.values(messages)
    }
  },
  mutations: {
    saveGroupMessages(state, { groupId, messages, index }) {
      if (!state.messages[groupId]) {
        Vue.set(state.messages, groupId, {})
      }
      messages.forEach(m => {
        Vue.set(state.messages[groupId], m.id, m)
      })
    },
    saveGroupMessage(state, { groupId, m }) {
      Vue.set(state.messages[groupId], m.id, m)
    },
    modifyGroupMessage(state, { groupId, m }) {
      let message = state.messages[groupId][m.id]
      let praises = ArrayUtils.update(message.praises || [], m.praises || [])
      let replys = ArrayUtils.update(message.replys || [], m.replys || [])
      let toUsers = ArrayUtils.update(message.toUsers || [], m.toUsers || [])
      Vue.set(state.messages[groupId], m.id, {
        ...message,
        ...m,
        ...{
          toUsers: toUsers,
          praises: praises,
          replys: replys
        }
      })
    },
    removeGroupMessage(state, { groupId, m }) {
      Vue.delete(state.messages[groupId], m.id)
    }
  }
}
